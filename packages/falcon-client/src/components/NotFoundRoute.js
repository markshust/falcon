import { EntityNotFoundError } from '@deity/falcon-errors';

export default ({ message = 'Entity not found' } = {}) => {
  throw new EntityNotFoundError(message);
};
