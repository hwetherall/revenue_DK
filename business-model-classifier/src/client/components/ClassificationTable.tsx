interface AgentResult {
    main: string;
    other?: string[];
    justification: string;
  }
  
  interface ClassificationResponse {
    customer: AgentResult;
    revenue: AgentResult;
    architecture: AgentResult;
    industry: AgentResult;
  }
  
  interface Props {
    result: ClassificationResponse;
  }
  
  export default function ClassificationTable({ result }: Props) {
    const rows: [string, AgentResult][] = [
      ['Customer Segment', result.customer],
      ['Revenue Model', result.revenue],
      ['Architecture', result.architecture],
      ['Industry', result.industry],
    ];
  
    return (
      <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="table-cell font-semibold text-gray-900">Category</th>
              <th className="table-cell font-semibold text-gray-900">Primary</th>
              <th className="table-cell font-semibold text-gray-900">Secondary / Other</th>
              <th className="table-cell font-semibold text-gray-900">Justification</th>
            </tr>
          </thead>
  
          <tbody>
            {rows.map(([label, data]) => (
              <tr key={label} className="hover:bg-gray-50">
                <td className="table-cell font-medium text-gray-900">{label}</td>
                <td className="table-cell">
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
                    {data.main}
                  </span>
                </td>
                <td className="table-cell text-gray-600">
                  {data.other && data.other.length ? data.other.join(', ') : '—'}
                </td>
                <td className="table-cell text-sm text-gray-600">{data.justification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  