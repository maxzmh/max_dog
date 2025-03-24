import { fieldControllerFindTypes } from '@/services/configure/field';
import { userControllerFindUserGroupAll } from '@/services/configure/user';
import { useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo } from 'react';

export const useSearchFieldType = () => {
  const { loading, run, data } = useRequest(fieldControllerFindTypes, {
    manual: true,
  });

  const options = useMemo(() => {
    return (
      data?.data?.data?.map?.((d) => ({
        label: d.name,
        value: d.id,
      })) || []
    );
  }, [data]);

  const onSearch = useCallback(
    (name) => {
      run({ name, type: name });
    },
    [run],
  );

  useEffect(() => {
    run();
  }, [run]);

  return { loading, options, onSearch };
};

export const useUserGroups = () => {
  const { loading, run, data } = useRequest(userControllerFindUserGroupAll, {
    manual: true,
  });

  const options = useMemo(() => {
    return (
      data?.data?.map?.((d) => ({
        label: d.groupName,
        value: d.id,
      })) || []
    );
  }, [data]);

  const onSearch = useCallback(
    (groupName) => {
      run({ groupName });
    },
    [run],
  );

  useEffect(() => {
    run();
  }, [run]);

  return { loading, options, onSearch };
};
