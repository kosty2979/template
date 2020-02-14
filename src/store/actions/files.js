import * as types from '../types/files';

export const fetchFiles = (data = [
]) => {
  return {
    routine: types.fetchFiles,
    promise: data => data.files,
  };
};
