import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import Header from "@/components/Header";
import {Button} from "@/components/ui/button";
import { sampleBooks } from "@/constants";

export default function page() {
  return (
    <>
   <BookOverview {...sampleBooks[0]} />

   <BookList 
   title="latest Books"
   books={sampleBooks}
   containterClassName="mt-28" />
    </>
  );
}