import * as React from 'react';
import { Fragment, SFC, ComponentType } from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { withCSSContext } from '@emotion/core';
import { mappings } from '../src/theme/propsmapings';

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

const BasePropsTable: SFC<PropsTableProps> = (props: any) => {
  const info = props.of.__docgenInfo;
  const components = props.components;
  const componentProps = info && info.props;
  const defaultProps = props.of.defaultProps;
  if (!info || !componentProps) {
    return null;
  }

  const Table = components.table || 'table';
  const Thead = components.thead || 'thead';
  const Tr = components.tr || 'tr';
  const Th = components.th || 'th';
  const Tbody = components.tbody || 'tbody';
  const Td = components.td || 'td';
  const Tooltip = components.tooltip;

  return (
    <Fragment>
      <Table className="PropsTable">
        <Thead>
          <Tr>
            <Th className="PropsTable--property">Property</Th>
            <Th className="PropsTable--type">Type</Th>
            <Th className="PropsTable--required">Required</Th>
            <Th className="PropsTable--default">Default</Th>
            <Th className="PropsTable--default">Themed</Th>
            <Th width="40%" className="PropsTable--description">
              Description
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {componentProps &&
            Object.keys(componentProps).map((name: string) => {
              const prop = componentProps[name];
              const themeKey = defaultProps.themeKey;
              const themedValue = props.theme.components[themeKey] ? props.theme.components[themeKey][name] : '';

              // const cssValue =  props.theme[]
              // if (props.theme.components[themeKey]) {

              // }

              if (!prop.flowType && !prop.type) return null;
              // TODO: uncomment
              if (!themedValue) return null;
              const mapping = (mappings as any)[name];

              const cssValue = mapping && mapping.themeProp ? (props.theme as any)[mapping.themeProp] : '';
              // console.log(mapping && mapping.themeProp);
              const cssStyle =
                mapping && mapping.themeProp === 'colors'
                  ? { backgroundColor: cssValue[themedValue], display: 'inline-block', height: '20px', width: '20px' }
                  : {};
              return (
                <Tr key={name}>
                  <Td>{name}</Td>
                  <Td>{getPropType(prop, Tooltip)}</Td>
                  <Td>{String(prop.required)}</Td>
                  <Td>{defaultProps[name]}</Td>
                  <Td>
                    {themedValue}-<span style={cssStyle} /> {cssValue[themedValue]}
                  </Td>
                  <Td>{prop.description && prop.description}</Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Fragment>
  );
};

export const PropsTable = withMDXComponents(
  withCSSContext((props: any, context: any) => {
    // console.log(props, context);
    return <BasePropsTable {...props} theme={context.theme} />;
  })
);
