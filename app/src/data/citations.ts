import type { Citation } from '../types';
import { facilities } from './facilities';

// Real F-Tag data from the Excel F-Tag Reference sheet
const fTagTemplates = [
  { tag: 'F880', desc: 'Provide and implement an infection prevention and control program.', category: 'Infection Control Deficiencies', resolution: 'Retrain all clinical staff on infection prevention protocols. Audit hand hygiene compliance. Verify PPE availability.', prevention: 'Use CMS-20054 monthly as self-audit. Designate IP champion per unit. Conduct unannounced observations weekly.' },
  { tag: 'F689', desc: 'Ensure area is free from accident hazards and provides adequate supervision.', category: 'Quality of Life and Care Deficiencies', resolution: 'Review all fall incidents for root cause. Update care plans for at-risk residents. Conduct immediate environmental safety audit.', prevention: 'Implement daily fall huddles. Use Morse Fall Scale on all admissions. Track fall rates monthly in QAPI.' },
  { tag: 'F812', desc: 'Procure food from approved sources and store, prepare, distribute safely.', category: 'Nutrition and Dietary Deficiencies', resolution: 'Deep clean/sanitize all kitchen equipment. Review and re-label all food storage. Retrain dietary staff.', prevention: 'Post temp logs at all refrigeration units. Conduct daily kitchen walk-through using CMS-20055.' },
  { tag: 'F684', desc: 'Provide appropriate treatment and care according to orders and preferences.', category: 'Quality of Life and Care Deficiencies', resolution: 'Review all care plans cited. Ensure physician notification documentation is complete. Verify treatments administered.', prevention: 'Implement weekly IDT rounds for high-acuity residents. Require MD/NP notification within 24 hours of condition change.' },
  { tag: 'F656', desc: 'Develop and implement a complete care plan that meets all resident needs.', category: 'Resident Assessment and Care Planning Deficiencies', resolution: 'Audit all active care plans for completeness. Update within 7 days. Ensure resident/family participation documented.', prevention: 'Conduct care plan audits on 10% of residents monthly. Include compliance in nursing supervisor checklists.' },
  { tag: 'F761', desc: 'Ensure drugs and biologicals are labeled in accordance with accepted professional principles.', category: 'Pharmacy Service Deficiencies', resolution: 'Audit all medication storage areas. Remove outdated/unlabeled meds. Retrain nursing staff on multi-dose vial protocols.', prevention: 'Weekly nursing supervisor medication storage rounds. Monthly pharmacy consultant audits.' },
  { tag: 'F600', desc: 'Protect each resident from all types of abuse such as physical, mental, sexual abuse.', category: 'Freedom from Abuse, Neglect, and Exploitation Deficiencies', resolution: 'Conduct immediate investigation per abuse policy. Report to state within required timeframe. Ensure resident safety.', prevention: 'Monthly abuse prevention training. Anonymous reporting hotline. Screen all new hires through state registries.' },
  { tag: 'F609', desc: 'Timely report suspected abuse, neglect, or theft and report investigation results.', category: 'Freedom from Abuse, Neglect, and Exploitation Deficiencies', resolution: 'Review all incident reports for required notifications. Ensure state agency reporting within required timeframes.', prevention: 'Implement automated notification tracking. Train charge nurses on mandatory reporting timelines.' },
  { tag: 'F677', desc: 'Provide care and assistance to perform activities of daily living.', category: 'Quality of Life and Care Deficiencies', resolution: 'Conduct ADL care audits for cited residents. Verify care plan reflects actual dependency level. Retrain staff.', prevention: 'Monthly ADL care observations. Include ADL quality metrics in QAPI dashboard.' },
  { tag: 'F755', desc: 'Provide pharmaceutical services to meet needs of each resident.', category: 'Pharmacy Service Deficiencies', resolution: 'Audit physician order compliance for all medications. Verify pharmacy reconciliation process.', prevention: 'Implement medication management QAPI indicators. Monthly pharmacist review of all active orders.' },
  // K-Tags (Life Safety Code)
  { tag: 'K335', desc: 'Exit access corridors are maintained free of obstructions.', category: 'Life Safety Code', resolution: 'Clear all corridor obstructions immediately. Review storage policies.', prevention: 'Daily safety rounds. Post corridor clearance reminders at each wing.' },
  { tag: 'K353', desc: 'Sprinkler system is properly maintained and tested.', category: 'Life Safety Code', resolution: 'Complete immediate sprinkler inspection. Schedule full system test.', prevention: 'Quarterly sprinkler inspections. Annual full-system testing. Document all results.' },
  { tag: 'K321', desc: 'Hazardous areas are properly separated from other areas.', category: 'Life Safety Code', resolution: 'Install proper barriers. Review hazardous area classifications.', prevention: 'Annual fire safety audit. Monthly hazardous area inspections.' },
  { tag: 'K281', desc: 'Fire doors are maintained and operational.', category: 'Life Safety Code', resolution: 'Repair/replace defective fire doors immediately. Test all fire door closures.', prevention: 'Monthly fire door inspection rounds. Log all deficiencies immediately.' },
  // E-Tags (Emergency Preparedness)
  { tag: 'E004', desc: 'Emergency preparedness plan includes risk assessment.', category: 'Emergency Preparedness', resolution: 'Update risk assessment with current hazards. Review annually.', prevention: 'Annual HVA update. Integrate into QAPI program.' },
  { tag: 'E009', desc: 'Emergency preparedness communication plan is maintained.', category: 'Emergency Preparedness', resolution: 'Update contact lists. Test communication systems.', prevention: 'Quarterly communication drills. Monthly contact list updates.' },
];

const severities: Citation['severity'][] = ['IJ', 'Actual Harm', 'Potential Harm', 'No Harm'];
const scopes: Citation['scope'][] = ['Isolated', 'Pattern', 'Widespread'];
const statuses: Citation['status'][] = ['Open', 'Corrected', 'Has Plan', 'No Plan', 'Past Non-Compliance'];
const surveyTypes = ['CMS Life Safety', 'CMS Health', 'State Fire Marshal', 'Joint Commission'];

let citationId = 0;

export const citations: Citation[] = facilities.flatMap((fac) => {
  if (fac.totalCitations === 0) return [];
  const count = Math.min(fac.totalCitations, 12); // cap for performance
  return Array.from({ length: count }, (_, i) => {
    const template = fTagTemplates[i % fTagTemplates.length];
    const isIJ = i < fac.ijCitations;
    const isAH = !isIJ && i < fac.ijCitations + fac.actualHarm;
    const severity: Citation['severity'] = isIJ ? 'IJ' : isAH ? 'Actual Harm' : i < fac.ijCitations + fac.actualHarm + fac.potentialHarm ? 'Potential Harm' : 'No Harm';

    citationId++;
    return {
      id: `cit-${citationId}`,
      facilityId: fac.id,
      tag: template.tag,
      description: template.desc,
      category: template.category,
      severity,
      scope: scopes[i % 3],
      status: isIJ || isAH ? (fac.corrected > 0 ? 'Corrected' : 'Open') : statuses[i % statuses.length],
      surveyDate: fac.lastSurveyDate,
      surveyType: surveyTypes[i % surveyTypes.length],
      documentationGaps: {
        tasks: Math.random() > 0.6,
        logs: Math.random() > 0.7,
        docs: Math.random() > 0.75,
      },
      resolutionSteps: template.resolution,
      preventionStrategies: template.prevention,
    };
  });
});
