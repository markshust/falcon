// eslint-disable-next-line import/no-extraneous-dependencies
import { configure as configureEnzyme } from 'enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies
import Adapter from 'enzyme-adapter-react-16';

configureEnzyme({ adapter: new Adapter() });
