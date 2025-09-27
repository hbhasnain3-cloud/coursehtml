// frontend/app/page.tsx
import { Suspense } from 'react';
import CourseGrid from '@/components/CourseGrid';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Learn Without Limits</h1>
          <p className="text-xl mb-8">100,000+ free courses from expert instructors</p>
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
          <CategoryFilter />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>
          <Suspense fallback={<CourseGridSkeleton />}>
            <CourseGrid 
              endpoint="/api/courses/featured"
              pagination={false}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}