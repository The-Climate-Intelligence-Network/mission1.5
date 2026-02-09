import { supabase } from "@/src/data/client/supabaseClient";
import { MissionWithStats } from "./types";

export async function getPublishedMissions(): Promise<{
    data: MissionWithStats[] | null;
    error: string | null;
}> {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { data: null, error: "Authentication required" };
        }

        const { data: missions, error } = await supabase
            .from("missions")
            .select(`
        *,
        organizations(name),
        mission_submissions(
          id,
          agent_id,
          status,
          guidance_evidence
        ),
        mission_bookmarks(
          id,
          agent_id
        )
      `)
            .eq("status", "published")
            .order("created_at", { ascending: false });

        if (error) {
            return { data: null, error: error.message };
        }

        // Transform data to include stats
        const missionStats: MissionWithStats[] = missions.map((mission: any) => {
            const submissions = mission.mission_submissions || [];
            const bookmarks = mission.mission_bookmarks || [];

            const uniqueParticipants = new Set(submissions.map((s: any) => s.agent_id));
            const completedSubmissions = submissions.filter((s: any) => s.status === "reviewed");
            const isBookmarked = bookmarks.some((b: any) => b.agent_id === user.id);
            const userSubmission = submissions.find((s: any) => s.agent_id === user.id);

            return {
                ...mission,
                organization_name: mission.organizations?.name || "Unknown Organization",
                participants_count: uniqueParticipants.size,
                submissions_count: submissions.length,
                completed_submissions_count: completedSubmissions.length,
                is_bookmarked: isBookmarked,
                submission_status: userSubmission?.status || null,
                // Calculate progress roughly if simple logic, or use helper if imported (avoid for now to minimize deps)
                submission_progress: userSubmission ? 0 : 0, // Placeholder, detailed logic in details.ts
            };
        });

        return { data: missionStats, error: null };
    } catch (err) {
        console.error("Error fetching published missions:", err);
        return { data: null, error: "Unexpected error" };
    }
}

export async function getMissionThumbnailUrl(path: string): Promise<string | null> {
    if (!path) return null;
    try {
        // Ensure path points to the thumbnails folder if not already
        const storagePath = path.startsWith('thumbnails/') ? path : `thumbnails/${path}`;

        // Use createSignedUrl for private buckets instead of getPublicUrl
        const { data, error } = await supabase.storage
            .from("mission-content")
            .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry

        if (error) {
            // Suppress 'Object not found' - commonly happens if file was deleted but DB record exists
            if (error.statusCode === '404' || (error.message && error.message.includes('Object not found'))) {
                console.log(`[Thumbnail Warning] File missing in storage: ${storagePath}`);
                return null;
            }
            console.error("Error signing URL:", error);
            return null;
        }

        console.log(`[Thumbnail Success] URL generated for: ${storagePath}`);
        return data.signedUrl;
    } catch (error: any) {
        // Suppress 'Object not found' errors as they are expected for some missions
        if (error.status === 400 || (error.message && error.message.includes('Object not found'))) {
            console.log(`[Thumbnail Warning] Image not found for path: ${path}`);
        } else {
            console.error("Error getting thumbnail URL:", error);
        }
        return null;
    }
}

export async function startMission(missionId: string): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Check if already started
        const { data: existing } = await supabase
            .from("mission_submissions")
            .select("*")
            .eq("mission_id", missionId)
            .eq("agent_id", user.id)
            .single();

        if (existing) {
            return { data: existing, error: null };
        }

        const { data, error } = await supabase
            .from("mission_submissions")
            .insert({
                mission_id: missionId,
                agent_id: user.id,
                status: "started",
                guidance_evidence: {}
            })
            .select()
            .single();

        return { data, error };
    } catch (err) {
        return { data: null, error: err };
    }
}

export async function toggleMissionBookmark(missionId: string): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Check if exists
        const { data: existing } = await supabase
            .from("mission_bookmarks")
            .select("id")
            .eq("mission_id", missionId)
            .eq("agent_id", user.id)
            .single();

        if (existing) {
            // Delete
            const { error } = await supabase
                .from("mission_bookmarks")
                .delete()
                .eq("id", existing.id);
            return { data: { bookmarked: false }, error };
        } else {
            // Create
            const { error } = await supabase
                .from("mission_bookmarks")
                .insert({
                    mission_id: missionId,
                    agent_id: user.id
                });
            return { data: { bookmarked: true }, error };
        }
    } catch (err) {
        return { data: null, error: err };
    }
}

export async function checkMissionStatus(missionId: string): Promise<string | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data } = await supabase
            .from("mission_submissions")
            .select("status")
            .eq("mission_id", missionId)
            .eq("agent_id", user.id)
            .single();

        return data?.status || null;
    } catch {
        return null;
    }
}
