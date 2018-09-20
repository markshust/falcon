import React, { Fragment, SFC, ComponentType } from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { withCSSContext } from '@emotion/core';
import { Table, Tr, Th, H2, Tbody, Td, Thead } from '../src';
/* eslint-disable */
export interface EnumValue {
  value: string;
  computed: boolean;
}

export interface FlowTypeElement {
  name: string;
  value: string;
}

export interface FlowTypeArgs {
  name: string;
  type: {
    name: string;
  };
}

export interface PropType {
  name: string;
  value?: any;
  raw?: any;
}

export interface FlowType extends PropType {
  elements: FlowTypeElement[];
  name: string;
  raw: string;
  type?: string;
  signature?: {
    arguments: FlowTypeArgs[];
    return: {
      name: string;
    };
  };
}

export interface Prop {
  required: boolean;
  description?: string;
  type: PropType;
  defaultValue?: {
    value: string;
    computed: boolean;
  };
  flowType?: FlowType;
}

export type ComponentWithDocGenInfo = ComponentType & {
  __docgenInfo: {
    description?: string;
    props?: Record<string, Prop>;
  };
};

export interface PropsTableProps {
  of: ComponentWithDocGenInfo;
  components: {
    [key: string]: ComponentType<any>;
  };
}

export type TooltipComponent = React.ComponentType<{
  text: React.ReactNode;
  children: React.ReactNode;
}>;

const getPropType = (prop: Prop, Tooltip?: TooltipComponent) => {
  const propName = prop.flowType ? prop.flowType.name : prop.type.name;
  const isEnum = false;
  const name = isEnum ? 'enum' : propName;
  const value = prop.type && prop.type.value;

  if (!name) return null;
  if (!Tooltip) return name;
  if (!prop.flowType && !isEnum && !value) return name;
  if (prop.flowType && !prop.flowType.elements) return name;

  return prop.flowType ? <Tooltip text={prop.flowType}>{name}</Tooltip> : <Tooltip text={prop.type}>{name}</Tooltip>;
};

const PropsTable: SFC<PropsTableProps> = (props: any) => {
  const info = props.of.__docgenInfo;
  const componentProps = info && info.props;

  if (!info || !componentProps) {
    return null;
  }



  return (
    <Fragment>
      <H2 pb="lg">Properties</H2>
      <Table>
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Type</Th>
            <Th>Required</Th>
            <Th>Default</Th>
            <Th width="40%">Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {componentProps &&
            Object.keys(componentProps).map((name: string) => {
              const prop = componentProps[name];
              if (!prop.flowType && !prop.type) return null;

              return (
                <Tr key={name}>
                  <Td>{name}</Td>
                  <Td>{prop.type.name}</Td>
                  <Td>{prop.required ? '🗸' : '-'}</Td>
                  <Td />
                  <Td>{prop.description && prop.description}</Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Fragment>
  );
};

export default withMDXComponents(
  withCSSContext((props: any, context: any) => {
    return <PropsTable {...props} theme={context.theme} />;
  })
);
