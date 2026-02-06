import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import toast from 'react-hot-toast'

export default function PatientDetails() {
  const router = useRouter()
  const { id } = router.query
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPatient()
    }
  }, [id])

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${id}`)
      if (!res.ok) throw new Error('Failed to fetch patient')
      const data = await res.json()
      setPatient(data)
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  const handleDelete = async () => {
    setShowDeleteModal(false)

    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Patient deleted successfully! 👋', {
          icon: '🗑️',
        })
        router.push('/')
      } else {
        toast.error('Failed to delete patient', {
          icon: '❌',
        })
      }
    } catch (err) {
      toast.error('Error deleting patient', {
        icon: '⚠️',
      })
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-pink-500 mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
              🦷
            </div>
          </div>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-2xl font-bold animate-pulse">
            Loading patient details...
          </p>
          <p className="text-gray-500 mt-2">Just a moment! ✨</p>
        </div>
      </Layout>
    )
  }

  if (error || !patient) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96 animate-fade-in">
          <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-red-200">
            <div className="text-6xl mb-4">😟</div>
            <p className="text-red-600 text-xl font-bold mb-4">{error || 'Patient not found'}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-6 sm:py-12 px-4 animate-fade-in">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.push('/')}
            className="mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 backdrop-blur-sm text-blue-600 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-blue-200 hover:border-purple-300 text-sm sm:text-base">
            <span className="text-lg sm:text-xl">←</span>
            <span className="hidden sm:inline">Back to Patient List</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl mb-3 animate-bounce">🦷✨</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Patient Profile
            </h1>
          </div>
        </div>

        {/* Patient Card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border-4 border-transparent hover:border-pink-200 transition-all duration-500 transform hover:scale-[1.02]">
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 md:p-8 border-b-4 border-pink-200 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 text-3xl opacity-20 animate-float">✨</div>
            <div className="absolute bottom-2 left-2 text-3xl opacity-20 animate-float-delayed">💙</div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 relative z-10">
              <div className="relative group">
                <img
                  src={patient.profileImage || '/default-profile.jpg'}
                  alt={`${patient.firstName} ${patient.lastName}`}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-pulse">
                  ✓
                </div>
                <div className="absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  ⭐
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {patient.firstName} {patient.lastName}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3">
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm sm:text-base lg:text-lg font-semibold flex items-center space-x-2 shadow-md">
                    <span>🎂</span>
                    <span>{calculateAge(patient.dateOfBirth)} years old</span>
                  </span>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold shadow-md">
                    ID: #{patient.id}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3 sm:mt-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-bold shadow-md">
                    👶 Pediatric Patient
                  </span>
                  {patient.lastVisit && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full text-xs font-bold shadow-md animate-pulse">
                      ✨ Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <label className="flex items-center text-sm font-bold text-blue-700 mb-2">
                  <span className="text-2xl mr-2">🎂</span>
                  Date of Birth
                </label>
                <p className="text-lg font-semibold text-gray-800">{formatDate(patient.dateOfBirth)}</p>
              </div>

              {/* Parent/Guardian */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <label className="flex items-center text-sm font-bold text-purple-700 mb-2">
                  <span className="text-2xl mr-2">👨‍👩‍👧</span>
                  Parent/Guardian
                </label>
                <p className="text-lg font-semibold text-gray-800">{patient.parentName}</p>
              </div>

              {/* Phone Number */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <label className="flex items-center text-sm font-bold text-green-700 mb-2">
                  <span className="text-2xl mr-2">📞</span>
                  Phone Number
                </label>
                <p className="text-lg font-semibold text-gray-800">{patient.phoneNumber}</p>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <label className="flex items-center text-sm font-bold text-orange-700 mb-2">
                  <span className="text-2xl mr-2">📧</span>
                  Email
                </label>
                <p className="text-lg font-semibold text-gray-800">{patient.email || 'N/A'}</p>
              </div>

              {/* Last Visit */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-2xl border-2 border-rose-200 hover:border-rose-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <label className="flex items-center text-sm font-bold text-rose-700 mb-2">
                  <span className="text-2xl mr-2">📅</span>
                  Last Visit
                </label>
                <p className="text-lg font-semibold text-gray-800">{formatDate(patient.lastVisit)}</p>
              </div>

              {/* Registration Date */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <label className="flex items-center text-sm font-bold text-indigo-700 mb-2">
                  <span className="text-2xl mr-2">🗓️</span>
                  Registered On
                </label>
                <p className="text-lg font-semibold text-gray-800">{formatDate(patient.createdAt)}</p>
              </div>
            </div>

            {/* Address */}
            {patient.address && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl border-2 border-teal-200 hover:border-teal-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <label className="flex items-center text-sm font-bold text-teal-700 mb-2">
                  <span className="text-2xl mr-2">🏠</span>
                  Address
                </label>
                <p className="text-lg font-semibold text-gray-800">{patient.address}</p>
              </div>
            )}

            {/* Medical Notes */}
            {patient.medicalNotes && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border-4 border-amber-200 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-pulse-slow">
                <label className="flex items-center text-sm font-bold text-amber-700 mb-3">
                  <span className="text-2xl mr-2">⚠️</span>
                  <span className="text-lg">Medical Notes (Important!)</span>
                </label>
                <p className="text-lg font-medium text-gray-800 leading-relaxed">{patient.medicalNotes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t-4 border-pink-200 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => router.push(`/patients/edit/${patient.id}`)}
              className="w-full sm:flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              <span className="text-xl sm:text-2xl">✏️</span>
              <span>Edit Patient</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 hover:from-red-600 hover:to-rose-700">
              <span className="text-xl sm:text-2xl">🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 p-4 sm:p-6 rounded-t-3xl">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl mb-2 sm:mb-3 animate-bounce">⚠️</div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Delete Patient?
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <p className="text-gray-700 text-center text-base sm:text-lg mb-2">
                Are you sure you want to delete
              </p>
              <p className="text-center text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                {patient?.firstName} {patient?.lastName}?
              </p>
              <p className="text-gray-600 text-center text-xs sm:text-sm">
                This action cannot be undone! 😟
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 pt-0">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </Layout>
  )
}