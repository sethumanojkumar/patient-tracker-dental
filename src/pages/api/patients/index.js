import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      // Get all patients
      try {
        const patients = await prisma.patient.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        })
        res.status(200).json(patients)
      } catch (error) {
        console.error('GET patients error:', error)
        res.status(500).json({ error: 'Failed to fetch patients', details: error.message })
      }
      break

    case 'POST':
      // Create a new patient
      try {
        const { 
          firstName, 
          lastName, 
          dateOfBirth, 
          parentName, 
          phoneNumber,
          email,
          address,
          profileImage,
          medicalNotes,
          lastVisit
        } = req.body

        const patient = await prisma.patient.create({
          data: {
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            parentName,
            phoneNumber,
            email: email || null,
            address: address || null,
            profileImage: profileImage || null,
            medicalNotes: medicalNotes || null,
            lastVisit: lastVisit && lastVisit !== '' ? new Date(lastVisit) : null
          }
        })
        res.status(201).json(patient)
      } catch (error) {
        console.error('POST patient error:', error)
        res.status(500).json({ error: 'Failed to create patient', details: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}