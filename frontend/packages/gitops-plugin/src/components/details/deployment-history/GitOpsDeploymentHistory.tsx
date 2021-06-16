import * as React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Table } from '@console/internal/components/factory';
import GitOpsDeploymentHistoryTableHeader from './GitOpsDeploymentHistoryTableHeader';
import GitOpsDeploymentHistoryTableRow from './GitOpsDeploymentHistoryTableRow';
import { GitOpsEnvironment, GitOpsHistoryData } from '../../utils/gitops-types';
import './GitOpsDeploymentHistory.scss';
import { FilterToolbar, RowFilter } from '@console/internal/components/filter-toolbar';

interface GitOpsHistoryProps {
  customData: {
    envs: GitOpsEnvironment[];
    appName: string;
  };
}

const silenceState = (s: GitOpsHistoryData): string => s.environment;

const GitOpsDeploymentHistory: React.FC<GitOpsHistoryProps> = ({
  customData: { envs, appName },
}) => {
  const { t } = useTranslation();

  // DUMMY DATA TO BE REMOVED
  const envNames = envs?.map((env) => {
    return env.environment;
  });
  const s1: string = envNames[0];
  const s2: string = envNames[1];

  const historyData: GitOpsHistoryData[] = [
    {
      last_deployment: new Date().getTime() /* eslint-disable-line @typescript-eslint/camelcase */,
      description: 'Update description',
      environment: s1,
      outcome: 'Succeeded',
      author: 'Tiger Woods',
      revision: 'rev1',
    },
    {
      last_deployment: new Date().getTime() /* eslint-disable-line @typescript-eslint/camelcase */,
      description: 'Deploy HRs',
      environment: s2,
      outcome: 'Failed',
      author: 'Vladimir Guerrero Jr.',
      revision: 'rev2',
    },
    {
      last_deployment: new Date().getTime() /* eslint-disable-line @typescript-eslint/camelcase */,
      description: `Description field ${{ appName }}`,
      environment: s1,
      outcome: 'Succeeded',
      author: 'Mike Weir',
      revision: 'SHA235023',
    },
    {
      last_deployment: new Date().getTime() /* eslint-disable-line @typescript-eslint/camelcase */,
      description: 'Update image',
      environment: s2,
      outcome: 'Failed',
      author: 'Dustin Pedroia',
      revision: 'SHA25342',
    },
  ];
  // END DUMMY DATA

  let filteredData = new Array<GitOpsHistoryData>();

  const uniqTextFilter = 'environments-filter';
  const uniqlabelFilter = 'environments-filter-id';

  type FilterKeys = {
    [key: string]: string;
  };

  const storagePrefix = 'rowFilter-';

  const envRowFilters: RowFilter[] = [
    {
      type: 'environment',
      filterGroupName: 'Environment',
      reducer: silenceState,
      items: _.map(envNames.sort(), (env) => ({
        id: env,
        title: env,
      })),
    },
  ];

  const filterKeys: FilterKeys = (envRowFilters ?? []).reduce((acc, curr) => {
    const str = `${storagePrefix}${curr.type}`;
    acc[curr.filterGroupName] = str;
    return acc;
  }, {});

  const { rowFiltersFromURL: selectedRowFilters } = (() => {
    const rowFiltersFromURL: string[] = [];
    const params = new URLSearchParams(window.location.search);
    const q = params.get(uniqlabelFilter);
    const name = params.get(uniqTextFilter);
    _.map(filterKeys, (f) => {
      const vals = params.get(f);
      if (vals) {
        rowFiltersFromURL.push(...vals.split(','));
      }
    });
    const labels = q ? q.split(',') : [];
    return { name, labels, rowFiltersFromURL };
  })();

  if (selectedRowFilters.length > 0) {
    historyData.forEach((history) => {
      selectedRowFilters.forEach((filter) => {
        if (history.environment === filter) {
          filteredData.push(history);
        }
      });
    });
  } else {
    filteredData = historyData;
  }

  return (
    <div className="odc-gitops-history-list">
      <div>
        <FilterToolbar
          data={historyData}
          reduxIDs={['gitops-environments']}
          hideNameLabelFilters
          rowFilters={envRowFilters}
        />
      </div>
      <Table
        data={filteredData}
        aria-label="Deployment History"
        Header={GitOpsDeploymentHistoryTableHeader(t)}
        Row={GitOpsDeploymentHistoryTableRow}
        loaded // TODO {!emptyStateMsg}
        rowFilters={envRowFilters}
      />
    </div>
  );
};

export default GitOpsDeploymentHistory;
