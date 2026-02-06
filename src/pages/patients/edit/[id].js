import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import toast from 'react-hot-toast'

export default function EditPatient() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    parentName: '',
    phoneNumber: '',
    email: '',
    address: '',
    profileImage: '',
    medicalNotes: '',
    lastVisit: ''
  })

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
      
      // Format dates for input fields (YYYY-MM-DD)
      const formattedData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        lastVisit: data.lastVisit ? data.lastVisit.split('T')[0] : '',
        email: data.email || '',
        address: data.address || '',
        profileImage: data.profileImage || '',
        medicalNotes: data.medicalNotes || ''
      }
      
      setFormData(formattedData)
      setImagePreview(data.profileImage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file', {
        icon: '🖼️',
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', {
        icon: '📏',
      })
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          profileImage: data.url
        }))
        toast.success('Image uploaded successfully!', {
          icon: '📸',
        })
      } else {
        toast.error('Failed to upload image', {
          icon: '❌',
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error uploading image', {
        icon: '⚠️',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Patient updated successfully! ✨', {
          icon: '💾',
        })
        router.push(`/patients/${id}`)
      } else {
        toast.error('Failed to update patient', {
          icon: '❌',
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error updating patient', {
        icon: '⚠️',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">✏️</div>
          </div>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-xl font-bold animate-pulse">
            Loading patient data...
          </p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96 animate-fade-in">
          <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-2 border-red-200">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-600 text-xl font-bold mb-4">{error}</p>
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
      <div className="max-w-3xl mx-auto py-6 sm:py-12 px-4 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={() => router.push(`/patients/${id}`)}
            className="mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 backdrop-blur-sm text-purple-600 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-purple-200 hover:border-pink-300 text-sm sm:text-base">
            <span className="text-lg sm:text-xl">←</span>
            <span className="hidden sm:inline">Back to Patient Details</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="text-4xl sm:text-5xl mb-3 animate-bounce">✏️🦷</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Edit Patient Info
          </h1>
          <p className="text-sm sm:text-base text-gray-600 text-lg">Update patient details below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300">
          {/* Profile Image Upload */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl">
            <label className="block text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center">
              <span className="text-xl sm:text-2xl mr-2">📸</span> Profile Picture (optional)
            </label>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <img
                  src={imagePreview || '/default-profile.jpg'}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                {uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 bg-opacity-80 rounded-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-1"></div>
                    <span className="text-white text-xs font-semibold">Uploading...</span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg animate-pulse">
                  ✨
                </div>
              </div>
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 file:shadow-lg file:cursor-pointer transition-all duration-300"
                />
                <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center">
                  <span className="mr-1">💡</span> Max size: 5MB</p>
              </div>
            </div>
          </div>

          {/* First Name and Last Name */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">👤</span> First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 hover:border-pink-300 text-gray-900 font-medium"
                placeholder="Enter first name"
              />
            </div>

            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">👤</span> Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 hover:border-pink-300 text-gray-900 font-medium"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-xl mr-2">🎂</span> Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 hover:border-blue-300 text-gray-900 font-medium"
            />
          </div>

          {/* Parent/Guardian Name */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-xl mr-2">👨‍👩‍👧</span> Parent/Guardian Name *
            </label>
            <input
              type="text"
              name="parentName"
              required
              value={formData.parentName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 hover:border-purple-300 text-gray-900 font-medium"
              placeholder="Parent or guardian name"
            />
          </div>

          {/* Phone Number and Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">📞</span> Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300 hover:border-green-300 text-gray-900 font-medium"
                placeholder="(123) 456-7890"
              />
            </div>

            <div className="transform hover:scale-105 transition-transform duration-300">
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">📧</span> Email (optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 hover:border-blue-300 text-gray-900 font-medium"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Address (Optional) */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-xl mr-2">🏠</span> Address (optional)
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-300 hover:border-yellow-300 text-gray-900 font-medium"
              placeholder="Street address, city, state"
            />
          </div>

          {/* Medical Notes (Optional) */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              📝 Medical Notes (optional)
            </label>
            <textarea
              name="medicalNotes"
              rows="4"
              value={formData.medicalNotes}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 hover:border-amber-300 transform hover:scale-[1.01] text-gray-900 font-medium"
              placeholder="Any medical conditions, allergies, or special notes..."
            />
          </div>

          {/* Last Visit (Optional) */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              📅 Last Visit Date (optional)
            </label>
            <input
              type="date"
              name="lastVisit"
              value={formData.lastVisit}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 hover:border-rose-300 transform hover:scale-105 text-gray-900 font-medium"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full sm:flex-1 py-3 sm:py-4 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span className="text-sm sm:text-base">Saving Changes...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Changes</span>
                  <span>✨</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/patients/${id}`)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border-2 border-gray-300 hover:border-purple-400 bg-white hover:bg-purple-50 font-semibold text-gray-700 hover:text-purple-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </Layout>
  )
}