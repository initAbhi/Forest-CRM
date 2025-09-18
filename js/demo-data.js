// Demo data for Hello Forest CRM

export const cases = [
  {
    id: 'C001',
    caseNo: 'FOR-2025-001',
    name: 'John Smith',
    phone: '+1-555-0123',
    email: 'john.smith@email.com',
    category: 'Wildlife Protection',
    district: 'Northern District',
    circle: 'Pine Circle',
    division: 'Forest Division A',
    status: 'Open',
    priority: 'High',
    description: 'Illegal logging reported in sector 7',
    createdAt: '2025-09-15T10:30:00Z',
    updatedAt: '2025-09-18T09:15:00Z'
  },
  {
    id: 'C002',
    caseNo: 'FOR-2025-002',
    name: 'Sarah Johnson',
    phone: '+1-555-0124',
    email: 'sarah.j@email.com',
    category: 'Fire Prevention',
    district: 'Southern District',
    circle: 'Oak Circle',
    division: 'Forest Division B',
    status: 'In Progress',
    priority: 'Medium',
    description: 'Fire hazard assessment needed for camping area',
    createdAt: '2025-09-14T14:20:00Z',
    updatedAt: '2025-09-17T16:45:00Z'
  },
  {
    id: 'C003',
    caseNo: 'FOR-2025-003',
    name: 'Mike Wilson',
    phone: '+1-555-0125',
    email: 'mike.wilson@email.com',
    category: 'Environmental Impact',
    district: 'Eastern District',
    circle: 'Birch Circle',
    division: 'Forest Division C',
    status: 'Closed',
    priority: 'Low',
    description: 'Environmental impact study completed',
    createdAt: '2025-09-10T11:00:00Z',
    updatedAt: '2025-09-16T13:30:00Z'
  },
  {
    id: 'C004',
    caseNo: 'FOR-2025-004',
    name: 'Emma Davis',
    phone: '+1-555-0126',
    email: 'emma.davis@email.com',
    category: 'Wildlife Protection',
    district: 'Western District',
    circle: 'Cedar Circle',
    division: 'Forest Division D',
    status: 'Open',
    priority: 'High',
    description: 'Endangered species habitat protection',
    createdAt: '2025-09-12T08:45:00Z',
    updatedAt: '2025-09-18T07:20:00Z'
  },
  {
    id: 'C005',
    caseNo: 'FOR-2025-005',
    name: 'David Brown',
    phone: '+1-555-0127',
    email: 'david.brown@email.com',
    category: 'Resource Management',
    district: 'Central District',
    circle: 'Maple Circle',
    division: 'Forest Division E',
    status: 'In Progress',
    priority: 'Medium',
    description: 'Timber harvest permit review',
    createdAt: '2025-09-13T15:30:00Z',
    updatedAt: '2025-09-17T12:15:00Z'
  }
];

export const knowledgebase = [
  {
    id: 'KB001',
    title: 'Forest Fire Prevention Guidelines',
    status: 'Public',
    category: 'Safety',
    content: 'Comprehensive guidelines for preventing forest fires including seasonal restrictions, equipment requirements, and emergency procedures.',
    author: 'Forest Safety Team',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-09-15T14:30:00Z',
    views: 1245
  },
  {
    id: 'KB002',
    title: 'Wildlife Protection Protocols',
    status: 'Public',
    category: 'Conservation',
    content: 'Standard operating procedures for wildlife protection, habitat preservation, and species monitoring.',
    author: 'Conservation Team',
    createdAt: '2025-08-28T09:15:00Z',
    updatedAt: '2025-09-10T16:45:00Z',
    views: 892
  },
  {
    id: 'KB003',
    title: 'Timber Harvesting Regulations',
    status: 'Private',
    category: 'Operations',
    content: 'Internal guidelines for sustainable timber harvesting, permit requirements, and quality control measures.',
    author: 'Operations Team',
    createdAt: '2025-08-25T11:30:00Z',
    updatedAt: '2025-09-08T13:20:00Z',
    views: 456
  },
  {
    id: 'KB004',
    title: 'Emergency Response Procedures',
    status: 'Public',
    category: 'Emergency',
    content: 'Step-by-step emergency response procedures for various forest-related incidents and natural disasters.',
    author: 'Emergency Response Team',
    createdAt: '2025-09-05T08:00:00Z',
    updatedAt: '2025-09-16T10:15:00Z',
    views: 2134
  },
  {
    id: 'KB005',
    title: 'Environmental Impact Assessment',
    status: 'Public',
    category: 'Environment',
    content: 'Guidelines for conducting environmental impact assessments for forest development projects.',
    author: 'Environmental Team',
    createdAt: '2025-08-30T14:45:00Z',
    updatedAt: '2025-09-12T11:00:00Z',
    views: 678
  }
];

export const officers = {
  ccf: [
    {
      id: 'CCF001',
      name: 'Robert Anderson',
      circle: 'Pine Circle',
      email: 'r.anderson@forest.gov',
      address: '123 Forest Ave, Pine City',
      description: 'Senior Forest Officer with 15 years experience',
      status: 'Active',
      phone: '+1-555-1001',
      joinDate: '2010-03-15'
    },
    {
      id: 'CCF002',
      name: 'Lisa Rodriguez',
      circle: 'Oak Circle',
      email: 'l.rodriguez@forest.gov',
      address: '456 Oak Street, Oak Town',
      description: 'Conservation specialist and wildlife expert',
      status: 'Active',
      phone: '+1-555-1002',
      joinDate: '2012-07-20'
    },
    {
      id: 'CCF003',
      name: 'James Mitchell',
      circle: 'Birch Circle',
      email: 'j.mitchell@forest.gov',
      address: '789 Birch Road, Birch Village',
      description: 'Fire prevention and emergency response coordinator',
      status: 'Inactive',
      phone: '+1-555-1003',
      joinDate: '2008-11-10'
    }
  ],
  dcf: [
    {
      id: 'DCF001',
      name: 'Maria Garcia',
      circle: 'Cedar Circle',
      email: 'm.garcia@forest.gov',
      address: '321 Cedar Lane, Cedar Heights',
      description: 'Deputy conservator specializing in resource management',
      status: 'Active',
      phone: '+1-555-2001',
      joinDate: '2014-02-28'
    },
    {
      id: 'DCF002',
      name: 'Thomas Lee',
      circle: 'Maple Circle',
      email: 't.lee@forest.gov',
      address: '654 Maple Drive, Maple Valley',
      description: 'Forest management and policy development expert',
      status: 'Active',
      phone: '+1-555-2002',
      joinDate: '2011-09-12'
    }
  ],
  acf: [
    {
      id: 'ACF001',
      name: 'Jennifer White',
      circle: 'Spruce Circle',
      email: 'j.white@forest.gov',
      address: '987 Spruce Way, Spruce Hills',
      description: 'Assistant conservator for environmental compliance',
      status: 'Active',
      phone: '+1-555-3001',
      joinDate: '2016-05-18'
    },
    {
      id: 'ACF002',
      name: 'Michael Chen',
      circle: 'Fir Circle',
      email: 'm.chen@forest.gov',
      address: '147 Fir Street, Fir Park',
      description: 'Technology integration and data management specialist',
      status: 'Active',
      phone: '+1-555-3002',
      joinDate: '2018-01-22'
    },
    {
      id: 'ACF003',
      name: 'Sandra Taylor',
      circle: 'Elm Circle',
      email: 's.taylor@forest.gov',
      address: '258 Elm Avenue, Elm Grove',
      description: 'Research and development coordinator',
      status: 'Inactive',
      phone: '+1-555-3003',
      joinDate: '2013-10-05'
    }
  ],
  rfo: [
    {
      id: 'RFO001',
      name: 'Kevin Johnson',
      circle: 'Willow Circle',
      email: 'k.johnson@forest.gov',
      address: '369 Willow Bend, Willow Creek',
      description: 'Range forest officer for field operations',
      status: 'Active',
      phone: '+1-555-4001',
      joinDate: '2019-04-10'
    },
    {
      id: 'RFO002',
      name: 'Amy Martinez',
      circle: 'Aspen Circle',
      email: 'a.martinez@forest.gov',
      address: '741 Aspen Trail, Aspen Ridge',
      description: 'Field operations and community outreach specialist',
      status: 'Active',
      phone: '+1-555-4002',
      joinDate: '2020-08-15'
    },
    {
      id: 'RFO003',
      name: 'Daniel Kim',
      circle: 'Redwood Circle',
      email: 'd.kim@forest.gov',
      address: '852 Redwood Path, Redwood Heights',
      description: 'Wildlife monitoring and habitat management',
      status: 'Active',
      phone: '+1-555-4003',
      joinDate: '2017-12-03'
    },
    {
      id: 'RFO004',
      name: 'Rachel Thompson',
      circle: 'Sequoia Circle',
      email: 'r.thompson@forest.gov',
      address: '963 Sequoia Grove, Sequoia Valley',
      description: 'Conservation education and public relations',
      status: 'Inactive',
      phone: '+1-555-4004',
      joinDate: '2015-06-25'
    }
  ]
};

export const dashboardData = {
  kpis: {
    todaysCalls: 47,
    openCases: 23,
    avgResponse: '2.4h',
    publicKB: 156
  },
  chartData: {
    calls: [12, 19, 25, 31, 28, 35, 42, 47],
    cases: [15, 18, 22, 20, 25, 23, 28, 23],
    response: [3.2, 2.8, 2.1, 2.4, 2.6, 2.2, 2.7, 2.4]
  },
  recentActivity: [
    {
      id: 1,
      type: 'case',
      description: 'New case created: Wildlife Protection',
      user: 'Sarah Johnson',
      timestamp: '2025-09-18T09:30:00Z'
    },
    {
      id: 2,
      type: 'kb',
      description: 'Knowledge base article updated: Fire Prevention',
      user: 'Robert Anderson',
      timestamp: '2025-09-18T09:15:00Z'
    },
    {
      id: 3,
      type: 'case',
      description: 'Case status changed to In Progress',
      user: 'Mike Wilson',
      timestamp: '2025-09-18T08:45:00Z'
    },
    {
      id: 4,
      type: 'officer',
      description: 'New officer assigned to Cedar Circle',
      user: 'Admin User',
      timestamp: '2025-09-18T08:20:00Z'
    },
    {
      id: 5,
      type: 'kb',
      description: 'New public article published: Emergency Procedures',
      user: 'Emergency Response Team',
      timestamp: '2025-09-18T07:55:00Z'
    }
  ]
};