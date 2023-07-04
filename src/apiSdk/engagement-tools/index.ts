import axios from 'axios';
import queryString from 'query-string';
import { EngagementToolsInterface, EngagementToolsGetQueryInterface } from 'interfaces/engagement-tools';
import { GetQueryInterface } from '../../interfaces';

export const getEngagementTools = async (query?: EngagementToolsGetQueryInterface) => {
  const response = await axios.get(`/api/engagement-tools${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEngagementTools = async (engagementTools: EngagementToolsInterface) => {
  const response = await axios.post('/api/engagement-tools', engagementTools);
  return response.data;
};

export const updateEngagementToolsById = async (id: string, engagementTools: EngagementToolsInterface) => {
  const response = await axios.put(`/api/engagement-tools/${id}`, engagementTools);
  return response.data;
};

export const getEngagementToolsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/engagement-tools/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEngagementToolsById = async (id: string) => {
  const response = await axios.delete(`/api/engagement-tools/${id}`);
  return response.data;
};
