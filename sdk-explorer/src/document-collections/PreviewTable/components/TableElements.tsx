import { Card, CardProps } from "@sanity/ui";
import { PropsWithChildren } from "react";

export function TR(props: PropsWithChildren<CardProps>) {
  const { children, ...rest } = props;
  return (
    <Card {...rest} style={{ display: "table-row" }} as="tr">
      {children}
    </Card>
  );
}

export function TD(props: PropsWithChildren<CardProps>) {
  const { children, ...rest } = props;
  return (
    <Card {...rest} style={{ display: "table-cell" }} as="td">
      {children}
    </Card>
  );
}

export function TH(props: PropsWithChildren<CardProps>) {
  const { children, ...rest } = props;
  return (
    <Card
      {...rest}
      style={{ display: "table-cell", textAlign: "left" }}
      as="th"
    >
      {children}
    </Card>
  );
}

export function Table(props: PropsWithChildren<CardProps>) {
  const { children, ...rest } = props;
  return (
    <Card
      {...rest}
      style={{ display: "table", borderCollapse: "collapse", width: "100%" }}
      as="table"
    >
      {children}
    </Card>
  );
}
