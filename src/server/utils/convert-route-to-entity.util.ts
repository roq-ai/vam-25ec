const mapping: Record<string, string> = {
  companies: 'company',
  'engagement-tools': 'engagement_tools',
  'performance-evaluations': 'performance_evaluation',
  'time-trackings': 'time_tracking',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
