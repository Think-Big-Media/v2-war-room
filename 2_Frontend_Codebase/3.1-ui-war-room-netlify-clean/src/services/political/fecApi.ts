/**
 * FEC (Federal Election Commission) OpenFEC API Service
 * Free API for campaign finance data
 * Documentation: https://api.open.fec.gov/developers/
 */

const API_BASE = 'https://api.open.fec.gov/v1';

// Note: Get free API key at https://api.open.fec.gov/developers/
const API_KEY = import.meta.env.VITE_FEC_API_KEY || '3kSPSUh0S5UnrM3XCLYLQcS1H31ILf04n5nqr9He';

interface Candidate {
  candidate_id: string;
  name: string;
  party: string;
  party_full: string;
  state: string;
  office: string;
  office_full: string;
  district?: string;
  incumbent_challenge?: string;
  incumbent_challenge_full?: string;
  candidate_status: string;
  cycles: number[];
  election_years?: number[];
  election_districts?: string[];
}

interface Committee {
  committee_id: string;
  name: string;
  treasurer_name?: string;
  organization_type?: string;
  organization_type_full?: string;
  designation?: string;
  designation_full?: string;
  committee_type?: string;
  committee_type_full?: string;
  party?: string;
  party_full?: string;
  state?: string;
  filing_frequency?: string;
  first_file_date?: string;
  last_file_date?: string;
}

interface Contribution {
  committee_id: string;
  committee_name?: string;
  contributor_name?: string;
  contributor_city?: string;
  contributor_state?: string;
  contributor_zip?: string;
  contributor_employer?: string;
  contributor_occupation?: string;
  contribution_receipt_date: string;
  contribution_receipt_amount: number;
  receipt_type?: string;
  receipt_type_full?: string;
  memo_text?: string;
  entity_type?: string;
}

interface FinancialSummary {
  committee_id: string;
  cycle: number;
  coverage_start_date?: string;
  coverage_end_date?: string;
  all_receipts?: number;
  all_loans_received?: number;
  total_receipts?: number;
  transfers_from_authorized?: number;
  total_individual_contributions?: number;
  individual_unitemized_contributions?: number;
  individual_itemized_contributions?: number;
  total_contributions?: number;
  other_political_committee_contributions?: number;
  political_party_committee_contributions?: number;
  candidate_contribution?: number;
  total_disbursements?: number;
  transfers_to_authorized?: number;
  total_loans_made?: number;
  total_independent_expenditures?: number;
  total_coordinated_expenditures?: number;
  cash_on_hand_beginning_period?: number;
  cash_on_hand_end_period?: number;
  debts_owed_by_committee?: number;
  debts_owed_to_committee?: number;
}

/**
 * Search for candidates
 */
export const searchCandidates = async (params: {
  state?: string;
  office?: string;
  cycle?: number;
  party?: string;
  name?: string;
}): Promise<Candidate[]> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    return [
      {
        candidate_id: 'P00000001',
        name: 'SMITH, JOHN',
        party: 'DEM',
        party_full: 'DEMOCRATIC PARTY',
        state: params.state || 'CA',
        office: params.office || 'P',
        office_full: 'President',
        candidate_status: 'C',
        cycles: [2024],
        election_years: [2024]
      },
      {
        candidate_id: 'P00000002',
        name: 'JONES, MARY',
        party: 'REP',
        party_full: 'REPUBLICAN PARTY',
        state: params.state || 'CA',
        office: params.office || 'P',
        office_full: 'President',
        candidate_status: 'C',
        cycles: [2024],
        election_years: [2024]
      }
    ];
  }

  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      per_page: '100',
      sort: '-total_receipts'
    });

    if (params.state) queryParams.append('state', params.state);
    if (params.office) queryParams.append('office', params.office);
    if (params.cycle) queryParams.append('cycle', params.cycle.toString());
    if (params.party) queryParams.append('party', params.party);
    if (params.name) queryParams.append('name', params.name);

    const response = await fetch(`${API_BASE}/candidates/?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`FEC API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
};

/**
 * Get candidate financial summary
 */
export const getCandidateFinancials = async (
  candidateId: string,
  cycle: number = 2024
): Promise<FinancialSummary | null> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    return {
      committee_id: 'C00000001',
      cycle,
      total_receipts: 15000000,
      total_contributions: 12000000,
      total_individual_contributions: 8000000,
      total_disbursements: 10000000,
      cash_on_hand_end_period: 5000000,
      debts_owed_by_committee: 500000
    };
  }

  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      cycle: cycle.toString()
    });

    const response = await fetch(
      `${API_BASE}/candidate/${candidateId}/totals/?${queryParams}`
    );
    
    if (!response.ok) {
      throw new Error(`FEC API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error('Error fetching candidate financials:', error);
    return null;
  }
};

/**
 * Get contributions to a committee
 */
export const getContributions = async (params: {
  committee_id?: string;
  contributor_state?: string;
  contributor_city?: string;
  min_amount?: number;
  max_amount?: number;
  cycle?: number;
}): Promise<Contribution[]> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    return [
      {
        committee_id: params.committee_id || 'C00000001',
        committee_name: 'Campaign Committee',
        contributor_name: 'DOE, JANE',
        contributor_city: 'LOS ANGELES',
        contributor_state: params.contributor_state || 'CA',
        contributor_employer: 'SELF-EMPLOYED',
        contributor_occupation: 'CONSULTANT',
        contribution_receipt_date: '2024-01-15',
        contribution_receipt_amount: 2900,
        receipt_type: '15',
        entity_type: 'IND'
      },
      {
        committee_id: params.committee_id || 'C00000001',
        committee_name: 'Campaign Committee',
        contributor_name: 'TECH COMPANY PAC',
        contributor_city: 'SAN FRANCISCO',
        contributor_state: params.contributor_state || 'CA',
        contribution_receipt_date: '2024-02-01',
        contribution_receipt_amount: 5000,
        receipt_type: '15C',
        entity_type: 'PAC'
      }
    ];
  }

  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      per_page: '100',
      sort: '-contribution_receipt_amount'
    });

    if (params.committee_id) {
      queryParams.append('committee_id', params.committee_id);
    }
    if (params.contributor_state) {
      queryParams.append('contributor_state', params.contributor_state);
    }
    if (params.contributor_city) {
      queryParams.append('contributor_city', params.contributor_city);
    }
    if (params.min_amount) {
      queryParams.append('min_amount', params.min_amount.toString());
    }
    if (params.max_amount) {
      queryParams.append('max_amount', params.max_amount.toString());
    }
    if (params.cycle) {
      queryParams.append('two_year_transaction_period', params.cycle.toString());
    }

    const response = await fetch(
      `${API_BASE}/schedules/schedule_a/?${queryParams}`
    );
    
    if (!response.ok) {
      throw new Error(`FEC API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return [];
  }
};

/**
 * Get state-level contribution statistics
 */
export const getStateContributionStats = async (
  state: string,
  cycle: number = 2024
): Promise<{
  totalContributions: number;
  totalContributors: number;
  averageContribution: number;
  topCommittees: Committee[];
}> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    return {
      totalContributions: 25000000,
      totalContributors: 15000,
      averageContribution: 1667,
      topCommittees: [
        {
          committee_id: 'C00000001',
          name: 'SMITH FOR PRESIDENT',
          committee_type: 'P',
          committee_type_full: 'Presidential',
          party: 'DEM',
          party_full: 'DEMOCRATIC PARTY',
          state
        },
        {
          committee_id: 'C00000002',
          name: 'JONES FOR PRESIDENT',
          committee_type: 'P',
          committee_type_full: 'Presidential',
          party: 'REP',
          party_full: 'REPUBLICAN PARTY',
          state
        }
      ]
    };
  }

  try {
    // Get state aggregates
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      cycle: cycle.toString(),
      state: state,
      per_page: '100'
    });

    const response = await fetch(
      `${API_BASE}/schedules/schedule_a/by_state/?${queryParams}`
    );
    
    if (!response.ok) {
      throw new Error(`FEC API error: ${response.statusText}`);
    }

    const data = await response.json();
    const stateData = data.results?.find((r: any) => r.state === state);

    // Get top committees in state
    const committeeParams = new URLSearchParams({
      api_key: API_KEY,
      state: state,
      per_page: '5',
      sort: '-receipts'
    });

    const committeeResponse = await fetch(
      `${API_BASE}/committees/?${committeeParams}`
    );
    
    const committeeData = committeeResponse.ok 
      ? await committeeResponse.json() 
      : { results: [] };

    return {
      totalContributions: stateData?.total || 0,
      totalContributors: stateData?.count || 0,
      averageContribution: stateData?.total && stateData?.count 
        ? Math.round(stateData.total / stateData.count) 
        : 0,
      topCommittees: committeeData.results || []
    };
  } catch (error) {
    console.error('Error fetching state contribution stats:', error);
    return {
      totalContributions: 0,
      totalContributors: 0,
      averageContribution: 0,
      topCommittees: []
    };
  }
};

/**
 * Get independent expenditures
 */
export const getIndependentExpenditures = async (params: {
  candidate_id?: string;
  committee_id?: string;
  state?: string;
  support_oppose?: 'S' | 'O';
  min_amount?: number;
  cycle?: number;
}): Promise<any[]> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    return [
      {
        committee_id: 'C00000003',
        committee_name: 'SUPER PAC FOR AMERICA',
        candidate_id: params.candidate_id || 'P00000001',
        candidate_name: 'SMITH, JOHN',
        support_oppose_indicator: params.support_oppose || 'S',
        expenditure_date: '2024-03-01',
        expenditure_amount: 100000,
        expenditure_description: 'TV ADS',
        payee_name: 'MEDIA COMPANY LLC',
        payee_state: params.state || 'CA'
      }
    ];
  }

  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      per_page: '100',
      sort: '-expenditure_date'
    });

    if (params.candidate_id) {
      queryParams.append('candidate_id', params.candidate_id);
    }
    if (params.committee_id) {
      queryParams.append('committee_id', params.committee_id);
    }
    if (params.state) {
      queryParams.append('payee_state', params.state);
    }
    if (params.support_oppose) {
      queryParams.append('support_oppose_indicator', params.support_oppose);
    }
    if (params.min_amount) {
      queryParams.append('min_amount', params.min_amount.toString());
    }
    if (params.cycle) {
      queryParams.append('cycle', params.cycle.toString());
    }

    const response = await fetch(
      `${API_BASE}/schedules/schedule_e/?${queryParams}`
    );
    
    if (!response.ok) {
      throw new Error(`FEC API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching independent expenditures:', error);
    return [];
  }
};

/**
 * Get election dates
 */
export const getElectionDates = async (
  cycle: number = 2024
): Promise<any[]> => {
  const dataMode = localStorage.getItem('dataMode');
  
  if (dataMode === 'MOCK' || !API_KEY) {
    return [
      {
        election_state: 'US',
        election_date: '2024-11-05',
        election_type_full: 'General Election',
        election_notes: 'Federal general election'
      },
      {
        election_state: 'CA',
        election_date: '2024-03-05',
        election_type_full: 'Primary Election',
        election_notes: 'California primary'
      }
    ];
  }

  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      cycle: cycle.toString(),
      per_page: '100'
    });

    const response = await fetch(`${API_BASE}/election-dates/?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`FEC API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching election dates:', error);
    return [];
  }
};