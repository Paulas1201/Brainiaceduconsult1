import { COMPANY_INFO } from '../data/copyData';

export interface WhatsAppLeadMessageData {
  name: string;
  email: string;
  whatsapp: string;
  examType: string;
  learningMode: string;
  subjects: string[];
  notes?: string;
}

export function generateCustomWhatsAppMessage(data: WhatsAppLeadMessageData): string {
  const subjectsStr = data.subjects.length > 0 ? data.subjects.join(', ') : 'Not specified';
  
  return `*Brainiac Educonsult - New Enrollment Enquiry* 🎓

*Student Name:* ${data.name}
*Email:* ${data.email}
*WhatsApp No:* ${data.whatsapp}
*Target Exam:* ${data.examType}
*Preferred Mode:* ${data.learningMode}
*Subjects Selected:* ${subjectsStr}
${data.notes ? `*Additional Request:* ${data.notes}\n` : ''}
_Hello Brainiac Educonsult team, I just filled out the enrollment form on your website. Please provide details on fees, timetable, and registration procedures!_`;
}

export function getWhatsAppLink(phone: string = COMPANY_INFO.whatsappFormatted, customMessage?: string): string {
  // sanitize phone number to international format without + or leading zero
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '234' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
    cleanPhone = '234' + cleanPhone;
  }

  const defaultMsg = `Hello Brainiac Educonsult! I would like to enquire about your tutorial classes for WAEC, NECO, JAMB, IGCSE & A-Levels.`;
  const textToEncode = customMessage || defaultMsg;
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToEncode)}`;
}

export function getPhoneCallLink(phone: string = COMPANY_INFO.primaryPhone): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `tel:+234${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;
}
