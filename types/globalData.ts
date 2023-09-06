export const lmsTypes = {
  canvas: 'canvas'
  //moodle: "moodle",
  //blackboard: "blackboard",
  //brightspace: "brightspace",
  //sakai: "sakai",
  //schoology: "schoology",
  //googleClassroom: "googleClassroom",
};

export const courseMemberRoles = {
  professor: 'professor', // Can do anything on the course
  student: 'student', // Cannot do anything
  ta: 'ta' // Can do anything except add/remove members
};

export const userRoles = {
  admin: 'admin', // Can do anything
  faculty: 'faculty', // Can create courses
  student: 'student' // Can view courses
};
