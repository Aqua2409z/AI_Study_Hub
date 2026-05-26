export interface CourseItem {
  id: string;
  name: string;
  progress: number;
  color: string;
}

interface CourseProgressProps {
  courses: CourseItem[];
}

export default function CourseProgress({ courses }: CourseProgressProps) {
  return (
    <div className="liquid-glass rounded-[20px] p-6">
      <h3 className="text-xl font-grotesk font-bold text-cream mb-6">Tiến độ học tập</h3>
      <div className="space-y-5">
        {(courses || [])?.map((course) => (
          <div key={course.id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cream/80">{course.name}</span>
              <span className="font-mono text-neon">{course.progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${course.color} transition-all duration-500`} 
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}