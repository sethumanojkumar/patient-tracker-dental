import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import * as XLSX from 'xlsx'

export default function Home() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPatients(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    const age = calculateAge(patient.dateOfBirth).toString()
    
    return (
      fullName.includes(query) ||
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.phoneNumber.includes(query) ||
      patient.parentName.toLowerCase().includes(query) ||
      (patient.email && patient.email.toLowerCase().includes(query)) ||
      patient.id.toString().includes(query) ||
      age.includes(query)
    )
  })

  const handleExportToExcel = () => {
    // Prepare data for Excel
    const exportData = patients.map((patient, index) => ({
      'Sr. No.': index + 1,
      'Patient ID': patient.id,
      'First Name': patient.firstName,
      'Last Name': patient.lastName,
      'Age': calculateAge(patient.dateOfBirth),
      'Date of Birth': new Date(patient.dateOfBirth).toLocaleDateString(),
      'Parent/Guardian': patient.parentName,
      'Phone Number': patient.phoneNumber,
      'Email': patient.email || 'N/A',
      'Address': patient.address || 'N/A',
      'Medical Notes': patient.medicalNotes || 'N/A',
      'Last Visit': patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A',
      'Registered On': new Date(patient.createdAt).toLocaleDateString()
    }))

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // Set column widths
    ws['!cols'] = [
      { wch: 8 },  // Sr. No.
      { wch: 12 }, // Patient ID
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 8 },  // Age
      { wch: 15 }, // Date of Birth
      { wch: 20 }, // Parent/Guardian
      { wch: 15 }, // Phone Number
      { wch: 25 }, // Email
      { wch: 30 }, // Address
      { wch: 30 }, // Medical Notes
      { wch: 15 }, // Last Visit
      { wch: 15 }  // Registered On
    ]

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Patients')

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0]
    const filename = `Patients_Data_${date}.xlsx`

    // Download file
    XLSX.writeFile(wb, filename)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600 text-xl font-semibold animate-pulse">
            Loading smiles... 😊
          </p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
            <p className="text-red-700 text-lg font-semibold">⚠️ {error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Our Little Smiles 😁✨
          </h2>
          <p className="text-gray-600 text-lg mb-6">Keeping track of happy, healthy teeth!</p>
          
          {patients.length > 0 && (
            <button
              onClick={handleExportToExcel}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-xl">📊</span>
              <span>Export to Excel</span>
              <span className="text-xl">✨</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        {patients.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl group-focus-within:scale-110 transition-transform duration-300">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, parent, age, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-12 py-4 text-gray-900 font-medium bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 hover:border-purple-300 shadow-lg hover:shadow-xl placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-pink-500 transition-colors duration-300"
                >
                  <span className="text-2xl">✕</span>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-center mt-3 text-gray-600 font-medium">
                Found <span className="text-purple-600 font-bold">{filteredPatients.length}</span> patient{filteredPatients.length !== 1 ? 's' : ''} 🎉
              </p>
            )}
          </div>
        )}

        {patients.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 animate-bounce">🦷</div>
            <p className="text-gray-600 text-xl mb-4">No patients yet! Let's add some smiles! 😊</p>
            <Link 
              href="/add-patient" 
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              ➕ Add Your First Patient
            </Link>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-8xl mb-6">🤔</div>
            <p className="text-gray-600 text-xl mb-4">No patients found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              🔄 Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPatients.map((patient, index) => (
              <Link 
                key={patient.id} 
                href={`/patients/${patient.id}`} 
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-pink-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-6">
                  {/* Profile Image */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={patient.profileImage || '/default-profile.jpg'}
                        alt={`${patient.firstName} ${patient.lastName}`}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:border-pink-300 transition-all duration-300 group-hover:scale-110"
                      />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg animate-pulse">
                        ✓
                      </div>
                    </div>
                  </div>
                  
                  {/* Patient Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-rose-600 transition-all duration-300 mb-2">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 text-gray-600 mb-3">
                      <span className="text-2xl">🎂</span>
                      <p className="font-semibold">{calculateAge(patient.dateOfBirth)} years old</p>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        👶 Pediatric
                      </span>
                      {patient.lastVisit && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          ✨ Active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover Effect Arrow */}
                  <div className="absolute bottom-4 right-4 text-pink-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </Layout>
  )
}