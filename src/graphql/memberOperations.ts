// src/graphql/memberOperations.ts

import { gql } from 'graphql-tag';

// Queries
export const GET_MEMBERS = gql`
  query GetMembers($filter: MemberFilterInput, $limit: Int, $offset: Int) {
    getMembers(filter: $filter, limit: $limit, offset: $offset) {
      id
      userId
      name
      kapisanan
      kahilingan
      callSign
      function
      picture
      Petsa_ng_maging_scan
      Pagpapatibay
      AssociateCategory
      AmatureCallsign
      schedules {
        id
        service
        date
        day
        time
      }
    }
  }
`;

export const GET_MEMBERS_WITH_SCHEDULES = gql`
  query GetMembersWithSchedules($date: String) {
    getMembersWithSchedules(date: $date) {
      id
      name
      kapisanan
      callSign
      function
      schedules {
        id
        service
        date
        day
        time
      }
    }
  }
`;

export const GET_MEMBER = gql`
  query GetMember($id: ID!) {
    getMember(id: $id) {
      id
      userId
      name
      kapisanan
      kahilingan
      callSign
      function
      picture
      Petsa_ng_maging_scan
      Pagpapatibay
      AssociateCategory
      AmatureCallsign
      schedules {
        id
        service
        date
        day
        time
      }
    }
  }
`;

export const GET_SCHEDULES_BY_DATE = gql`
  query GetSchedulesByDate($date: String!) {
    getSchedulesByDate(date: $date) {
      id
      service
      date
      day
      time
      member {
        id
        name
        callSign
        function
      }
    }
  }
`;

export const GET_SCHEDULES_BY_MEMBER = gql`
  query GetSchedulesByMember($memberId: String!) {
    getSchedulesByMember(memberId: $memberId) {
      id
      service
      date
      day
      time
    }
  }
`;

export const GET_MEMBERS_WITH_PENDING_REQUESTS = gql`
  query GetMembersWithPendingRequests {
    getMembersWithPendingRequests {
      id
      name
      kapisanan
      kahilingan
      callSign
      function
      schedules {
        id
        service
        date
        day
        time
      }
    }
  }
`;

// Mutations
export const CREATE_MEMBER = gql`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      id
      userId
      name
      kapisanan
      kahilingan
      callSign
      function
      picture
      Petsa_ng_maging_scan
      Pagpapatibay
      AssociateCategory
      AmatureCallsign
      schedules {
        id
        service
        date
        day
        time
      }
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($id: ID!, $input: UpdateMemberInput!) {
    updateMember(id: $id, input: $input) {
      id
      name
      kapisanan
      kahilingan
      callSign
      function
      picture
      Petsa_ng_maging_scan
      Pagpapatibay
      AssociateCategory
      AmatureCallsign
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation DeleteMember($id: ID!) {
    deleteMember(id: $id)
  }
`;

export const TOGGLE_MEMBER_KAHLINGAN = gql`
  mutation ToggleMemberKahilingan($id: ID!) {
    toggleMemberKahilingan(id: $id) {
      id
      kahilingan
    }
  }
`;

export const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($input: CreateScheduleInput!) {
    createSchedule(input: $input) {
      id
      service
      date
      day
      time
      memberId
    }
  }
`;

export const CREATE_MULTIPLE_SCHEDULES = gql`
  mutation CreateMultipleSchedules($inputs: [CreateScheduleInput!]!) {
    createMultipleSchedules(inputs: $inputs) {
      id
      service
      date
      day
      time
    }
  }
`;

export const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule($id: ID!, $input: UpdateScheduleInput!) {
    updateSchedule(id: $id, input: $input) {
      id
      service
      date
      day
      time
    }
  }
`;

export const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($id: ID!) {
    deleteSchedule(id: $id)
  }
`;

export const DELETE_ALL_SCHEDULES_BY_MEMBER = gql`
  mutation DeleteAllSchedulesByMember($memberId: String!) {
    deleteAllSchedulesByMember(memberId: $memberId)
  }
`;

export const CLEAR_SCHEDULE_CONFLICTS = gql`
  mutation ClearScheduleConflicts($memberId: String!, $date: String!) {
    clearScheduleConflicts(memberId: $memberId, date: $date) {
      id
      service
      date
      day
      time
    }
  }
`;
