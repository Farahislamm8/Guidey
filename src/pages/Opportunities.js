import React, { useState } from 'react'
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase,
  GraduationCap,
  ExternalLink,
  Building
} from 'lucide-react'

const sampleOpportunities = [
  {
    id: '1',
    title: 'Software Engineering Internship',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'internship',
    salary: '$8,000/month',
    duration: '12 weeks',
    deadline: '2025-03-15',
    description: 'Join our team to build innovative products that impact billions of users worldwide.',
    requirements: ['Computer Science student', 'Python/Java proficiency', 'Data structures knowledge'],
    remote: false,
    featured: true,
  },
  {
    id: '2',
    title: 'UX Design Scholarship',
    company: 'Adobe Foundation',
    location: 'Worldwide',
    type: 'scholarship',
    salary: '$10,000',
    deadline: '2025-04-01',
    description: 'Supporting underrepresented students pursuing careers in design and creativity.',
    requirements: ['Design portfolio', 'Undergraduate student', 'Financial need demonstration'],
    remote: true,
    featured: true,
  },
  {
    id: '3',
    title: 'Junior Data Analyst',
    company: 'Microsoft',
    location: 'Seattle, WA',
    type: 'entry-level',
    salary: '$75,000 - $95,000',
    description: 'Analyze data to drive business decisions and create actionable insights.',
    requirements: ['Bachelor\'s degree', 'SQL proficiency', 'Excel/Power BI experience'],
    remote: true,
    featured: false,
  },
  {
    id: '4',
    title: 'AI Career Conference 2025',
    company: 'TechCareers',
    location: 'San Francisco, CA',
    type: 'event',
    deadline: '2025-02-28',
    description: 'Network with industry professionals and learn about AI career opportunities.',
    requirements: ['Student ID', 'Interest in AI/ML'],
    remote: false,
    featured: false,
  },
  {
    id: '5',
    title: 'Frontend Developer Internship',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'internship',
    salary: '$7,500/month',
    duration: '10 weeks',
    deadline: '2025-03-20',
    description: 'Build user interfaces for our streaming platform used by millions globally.',
    requirements: ['React.js experience', 'JavaScript proficiency', 'Portfolio of projects'],
    remote: false,
    featured: true,
  },
  {
    id: '6',
    title: 'Digital Marketing Associate',
    company: 'Spotify',
    location: 'New York, NY',
    type: 'entry-level',
    salary: '$55,000 - $70,000',
    description: 'Drive user acquisition and engagement through digital marketing campaigns.',
    requirements: ['Marketing degree', 'Google Analytics', 'Social media expertise'],
    remote: true,
    featured: false,
  }
]

const Opportunities = () => {
  const [opportunities] = useState(sampleOpportunities)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'internship', label: 'Internships' },
    { value: 'entry-level', label: 'Entry Level' },
    { value: 'scholarship', label: 'Scholarships' },
    { value: 'event', label: 'Events' },
  ]

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || opportunity.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'internship': return Briefcase
      case 'entry-level': return Building
      case 'scholarship': return GraduationCap
      case 'event': return Clock
      default: return Briefcase
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'internship': return '#8B5CF6'
      case 'entry-level': return '#10B981'
      case 'scholarship': return '#F59E0B'
      case 'event': return '#EF4444'
      default: return '#8B5CF6'
    }
  }

  const formatDeadline = (deadline) => {
    if (!deadline) return null
    const date = new Date(deadline)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Career Opportunities</h1>
        <p className="page-subtitle">Find internships, jobs, and scholarships</p>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '0 16px',
          height: '48px',
          marginTop: '20px'
        }}>
          <Search size={20} color="#64748B" style={{ marginRight: '12px' }} />
          <input
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              backgroundColor: 'transparent'
            }}
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        padding: '16px 20px',
        gap: '12px'
      }}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              backgroundColor: selectedFilter === filter.value ? '#8B5CF6' : '#FFFFFF',
              color: selectedFilter === filter.value ? '#FFFFFF' : '#64748B',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onClick={() => setSelectedFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {filteredOpportunities.map((opportunity) => {
          const TypeIcon = getTypeIcon(opportunity.type)
          const typeColor = getTypeColor(opportunity.type)

          return (
            <div key={opportunity.id} className="card" style={{ 
              padding: '20px', 
              marginBottom: '16px',
              position: 'relative',
              cursor: 'pointer'
            }}>
              {opportunity.featured && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  Featured
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px' 
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  backgroundColor: `${typeColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <TypeIcon size={20} color={typeColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    marginBottom: '2px' 
                  }}>
                    {opportunity.title}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#8B5CF6' 
                  }}>
                    {opportunity.company}
                  </p>
                </div>
                <ExternalLink size={20} color="#CBD5E1" />
              </div>

              <p style={{ 
                fontSize: '14px', 
                color: '#64748B', 
                lineHeight: '1.4', 
                marginBottom: '16px' 
              }}>
                {opportunity.description}
              </p>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '8px' 
                }}>
                  <MapPin size={16} color="#64748B" />
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#64748B', 
                    marginLeft: '8px' 
                  }}>
                    {opportunity.location} {opportunity.remote && '(Remote)'}
                  </span>
                </div>
                
                {opportunity.salary && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px' 
                  }}>
                    <DollarSign size={16} color="#64748B" />
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#64748B', 
                      marginLeft: '8px' 
                    }}>
                      {opportunity.salary}
                    </span>
                  </div>
                )}
                
                {opportunity.duration && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px' 
                  }}>
                    <Clock size={16} color="#64748B" />
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#64748B', 
                      marginLeft: '8px' 
                    }}>
                      {opportunity.duration}
                    </span>
                  </div>
                )}
                
                {opportunity.deadline && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px' 
                  }}>
                    <GraduationCap size={16} color="#64748B" />
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#64748B', 
                      marginLeft: '8px' 
                    }}>
                      Apply by {formatDeadline(opportunity.deadline)}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  marginBottom: '8px' 
                }}>
                  Requirements:
                </h4>
                {opportunity.requirements.slice(0, 3).map((requirement, index) => (
                  <p key={index} style={{ 
                    fontSize: '13px', 
                    color: '#64748B', 
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    • {requirement}
                  </p>
                ))}
              </div>

              <button style={{
                backgroundColor: typeColor,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                width: '100%',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                {opportunity.type === 'event' ? 'Learn More' : 'Apply Now'}
              </button>
            </div>
          )
        })}

        {filteredOpportunities.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 0' 
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '8px' 
            }}>
              No opportunities found
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#64748B' 
            }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Opportunities