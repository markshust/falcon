import gql from 'graphql-tag';
import { Query } from '../Query/Query';
import { MenuItem } from '../Header';

const GET_FOOTER_DATA = gql`
  query GET_FOOTER_DATA {
    config @client {
      menus {
        footer {
          name
          children {
            name
            url
          }
        }
      }
      languages {
        name
        code
        active
      }
    }
  }
`;

export type LanguageItem = {
  name: string;
  code: string;
  active: boolean;
};

export type FooterData = {
  config: {
    menus: {
      footer: MenuItem[];
    };
    languages: LanguageItem[];
  };
};

export class FooterQuery extends Query<FooterData> {
  static defaultProps = {
    query: GET_FOOTER_DATA
  };
}
