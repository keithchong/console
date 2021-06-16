import { TFunction } from 'i18next';
import { sortable } from '@patternfly/react-table';
import { tableColumnClasses } from './history-table';

const GitOpsDeploymentHistoryTableHeader = (t: TFunction) => () => {
  return [
    {
      title: t('gitops-plugin~Last deployment'),
      sortField: 'lastDeployment',
      transforms: [sortable],
      props: { className: tableColumnClasses[0] },
    },
    {
      title: t('gitops-plugin~Description'),
      sortField: 'description',
      transforms: [sortable],
      props: { className: tableColumnClasses[1] },
    },
    {
      title: t('gitops-plugin~Environment'),
      sortField: 'environment',
      transforms: [sortable],
      props: { className: tableColumnClasses[2] },
    },
    {
      title: t('gitops-plugin~Outcome'),
      sortField: 'outcome',
      transforms: [sortable],
      props: { className: tableColumnClasses[3] },
    },
    {
      title: t('gitops-plugin~Author'),
      sortField: 'author',
      transforms: [sortable],
      props: { className: tableColumnClasses[4] },
    },
    {
      title: t('gitops-plugin~Revision'),
      sortField: 'revision',
      transforms: [sortable],
      props: { className: tableColumnClasses[5] },
    },
  ];
};

export default GitOpsDeploymentHistoryTableHeader;
