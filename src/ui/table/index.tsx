import React, { createContext, useMemo, useContext } from 'react';
import { View, Text } from 'react-native';

import {
  tableStyle,
  tableHeaderStyle,
  tableBodyStyle,
  tableFooterStyle,
  tableHeadStyle,
  tableRowStyleStyle,
  tableDataStyle,
  tableCaptionStyle,
} from './styles';

const TableHeaderContext = createContext<{
  isHeaderRow: boolean;
}>({
  isHeaderRow: false,
});

const TableFooterContext = createContext<{
  isFooterRow: boolean;
}>({
  isFooterRow: false,
});

type ITableProps = React.ComponentProps<typeof View>;
type ITableHeaderProps = React.ComponentProps<typeof View>;
type ITableBodyProps = React.ComponentProps<typeof View>;
type ITableFooterProps = React.ComponentProps<typeof View>;
type ITableHeadProps =
  | ({ useRNView?: true } & React.ComponentProps<typeof View>)
  | ({ useRNView?: false } & React.ComponentProps<typeof Text>);
type ITableRowProps = React.ComponentProps<typeof View>;
type ITableDataProps =
  | ({ useRNView?: true } & React.ComponentProps<typeof View>)
  | ({ useRNView?: false } & React.ComponentProps<typeof Text>);
type ITableCaptionProps = React.ComponentProps<typeof Text>;

const Table = React.forwardRef<
  React.ComponentRef<typeof View>,
  ITableProps
>(({ className, ...props }, ref) => {
  return (
    <View
      ref={ref}
      className={tableStyle({ class: className })}
      {...props}
    />
  );
});

const TableHeader = React.forwardRef<
  React.ComponentRef<typeof View>,
  ITableHeaderProps
>(function TableHeader({ className, ...props }, ref) {
  const contextValue = useMemo(() => {
    return {
      isHeaderRow: true,
    };
  }, []);
  return (
    <TableHeaderContext.Provider value={contextValue}>
      <View
        ref={ref}
        className={tableHeaderStyle({ class: className })}
        {...props}
      />
    </TableHeaderContext.Provider>
  );
});

const TableBody = React.forwardRef<
  React.ComponentRef<typeof View>,
  ITableBodyProps
>(function TableBody({ className, ...props }, ref) {
  return (
    <View
      ref={ref}
      className={tableBodyStyle({ class: className })}
      {...props}
    />
  );
});

const TableFooter = React.forwardRef<
  React.ComponentRef<typeof View>,
  ITableFooterProps
>(function TableFooter({ className, ...props }, ref) {
  const contextValue = useMemo(() => {
    return {
      isFooterRow: true,
    };
  }, []);
  return (
    <TableFooterContext.Provider value={contextValue}>
      <View
        ref={ref}
        className={tableFooterStyle({ class: className })}
        {...props}
      />
    </TableFooterContext.Provider>
  );
});

const TableHead = React.forwardRef<
  React.ComponentRef<typeof View> | React.ComponentRef<typeof Text>,
  ITableHeadProps
>(function TableHead({ useRNView = false, className, ...props }, ref) {
  if (useRNView) {
    const viewProps = props as React.ComponentProps<typeof View>;
    return (
      <View
        ref={ref as React.Ref<React.ComponentRef<typeof View>>}
        className={tableHeadStyle({ class: className })}
        {...viewProps}
      />
    );
  }
  const textProps = props as React.ComponentProps<typeof Text>;
  return (
    <Text
      ref={ref as React.Ref<React.ComponentRef<typeof Text>>}
      className={tableHeadStyle({ class: className })}
      style={{ fontFamily: 'SpaceMono' }}
      {...textProps}
    />
  );
});

const TableRow = React.forwardRef<
  React.ComponentRef<typeof View>,
  ITableRowProps
>(function TableRow({ className, ...props }, ref) {
  const { isHeaderRow } = useContext(TableHeaderContext);
  const { isFooterRow } = useContext(TableFooterContext);

  return (
    <View
      ref={ref}
      className={tableRowStyleStyle({
        isHeaderRow,
        isFooterRow,
        class: className,
      })}
      {...props}
    />
  );
});

const TableData = React.forwardRef<
  React.ComponentRef<typeof View> | React.ComponentRef<typeof Text>,
  ITableDataProps
>(function TableData({ useRNView = false, className, ...props }, ref) {
  if (useRNView) {
    const viewProps = props as React.ComponentProps<typeof View>;
    return (
      <View
        ref={ref as React.Ref<React.ComponentRef<typeof View>>}
        className={tableDataStyle({ class: className })}
        {...viewProps}
      />
    );
  }
  const textProps = props as React.ComponentProps<typeof Text>;
  return (
    <Text
      ref={ref as React.Ref<React.ComponentRef<typeof Text>>}
      className={tableDataStyle({ class: className })}
      style={{ fontFamily: 'SpaceMono' }}
      {...textProps}
    />
  );
});

const TableCaption = React.forwardRef<
  React.ComponentRef<typeof Text>,
  ITableCaptionProps
>(({ className, ...props }, ref) => {
  return (
    <Text
      ref={ref}
      className={tableCaptionStyle({ class: className })}
      style={{ fontFamily: 'SpaceMono' }}
      {...props}
    />
  );
});

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableFooter.displayName = 'TableFooter';
TableHead.displayName = 'TableHead';
TableRow.displayName = 'TableRow';
TableData.displayName = 'TableData';
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableData,
  TableCaption,
};
