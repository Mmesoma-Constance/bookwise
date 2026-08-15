import BookList from '@/components/BookList';
import { sampleBooks } from '@/constants';

export default function LibraryPage() {
  return (
    <main className="space-y-8">
      <section className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-light-200">Browse</p>
        <h1 className="font-bebas-neue text-5xl text-light-100">Library</h1>
      </section>

      <BookList title="All Books" books={sampleBooks} />
    </main>
  );
}
