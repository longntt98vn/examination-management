import { useEffect, useState } from "react";
import type { User } from "../../../constants/types";
import { MODAL_TYPES, useModal } from "../../../providers/ModalProvider";
import { getAllUsers } from "../../../apis/user";
import { Role } from "../../../constants";

export const useStudentListModal = () => {
  const { modals } = useModal();
  const [localStudents, setLocalStudents] = useState<User[]>([]);

  const { selectedStudents, students } = modals[MODAL_TYPES.STUDENT_LIST].data;
  const [localSelectedStudents, setLocalSelectedStudents] = useState<string[]>(
    [],
  );

  const onSelectStudent = (studentId: string) => {
    if (localSelectedStudents.includes(studentId)) {
      const newArr = localSelectedStudents.filter((id) => id !== studentId);
      setLocalSelectedStudents(newArr);
    } else {
      const newArr = [...localSelectedStudents, studentId];
      setLocalSelectedStudents(newArr);
    }
  };

  useEffect(() => {
    if (modals[MODAL_TYPES.STUDENT_LIST].isOpen) {
      setLocalSelectedStudents(
        selectedStudents?.map((student) => student._id) || [],
      );
      if (!students) {
        getAllUsers().then((data) => {
          setLocalStudents(
            data.filter((user: User) => user.role === Role.STUDENT) as User[],
          );
        });
      } else {
        setLocalStudents(students);
      }
    }
  }, [modals[MODAL_TYPES.STUDENT_LIST].isOpen]);

  return {
    localStudents,
    localSelectedStudents,
    onSelectStudent,
  };
};
