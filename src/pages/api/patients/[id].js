import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  const { method } = req
  const { id } = req.query

  switch (method) {
    case 'GET':
      // Get a single patient
      try {
        const patient = await prisma.patient.findUnique({
          where: { id }
        })
        if (!patient) {
          return res.status(404).json({ error: 'Patient not found' })
        }
        res.status(200).json(patient)
      } catch (error) {
        console.error('GET patient error:', error)
        res.status(500).json({ error: 'Failed to fetch patient', details: error.message })
      }
      break

    case 'PUT':
      // Update a patient
      try {
        const updateData = { ...req.body }
        
        // Remove fields that shouldn't be updated
        delete updateData.id
        delete updateData.createdAt
        delete updateData.updatedAt
        
        // Convert date strings to Date objects if present and valid
        if (updateData.dateOfBirth) {
          updateData.dateOfBirth = new Date(updateData.dateOfBirth)
        }
        
        // Handle lastVisit - set to null if empty string, otherwise convert to Date
        if (updateData.lastVisit === '' || updateData.lastVisit === null) {
          updateData.lastVisit = null
        } else if (updateData.lastVisit) {
          updateData.lastVisit = new Date(updateData.lastVisit)
        }

        const patient = await prisma.patient.update({
          where: { id },
          data: updateData
        })
        res.status(200).json(patient)
      } catch (error) {
        console.error('PUT patient error:', error)
        res.status(500).json({ error: 'Failed to update patient', details: error.message })
      }
      break

    case 'DELETE':
      // Delete a patient
      try {
        await prisma.patient.delete({
          where: { id }
        })
        res.status(204).end()
      } catch (error) {
        console.error('DELETE patient error:', error)
        res.status(500).json({ error: 'Failed to delete patient', details: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}