import MainLayout from "@/components/layout/MainLayout";
import { useUserRole } from "@/hooks/useUserRole";
import LessonCalendar from "@/components/lessons/LessonCalendar";
import LessonsList from "@/components/lessons/LessonsList";
import LessonRequestDialog from "@/components/lessons/LessonRequestDialog";

const Lessons = () => {
  const { role } = useUserRole();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Mes cours</h1>
            <p className="text-gray-600 mt-2">Gérez vos sessions de tutorat</p>
          </div>
          {role === 'student' && <LessonRequestDialog />}
        </div>

        <LessonCalendar userRole={(role === 'super_admin' ? 'student' : role) as 'student' | 'teacher' | 'parent'} />
        <LessonsList />
      </div>
    </MainLayout>
  );
};

export default Lessons;
