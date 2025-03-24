import Image from "next/image";
import Link from "next/link";
import React from "react";

import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";

const Home = () => {
  return (
    <>
      <section className={"card-cta"}>
        <div className={" flex flex-col gap-6 max-w-lg"}>
          <h2>Get interview ready with PrepWise</h2>
          <p>Practice on real questions</p>
          <Button asChild className={"btn-primary max-sm:w-full"}>
            <Link href="/interview">Start an interview</Link>
          </Button>
        </div>
        <Image
          src={"/robot.png"}
          alt={"robot"}
          width={400}
          height={400}
          className={"max-sm:hidden"}
        />
      </section>

      <section className={"flex flex-col gap-6 mt-8"}>
        <h2>Your interviews</h2>
        <div className={"interviews-section"}>
          {dummyInterviews.map((interview) => {
            return <InterviewCard key={interview.id} {...interview} />;
          })}
          {/* <p>You haven&apos;t taken any interviews yet</p>*/}
        </div>
      </section>

      <section className={"flex flex-col gap-6 mt-8"}>
        <h2>Take an interview</h2>
        <div className={"interviews-section"}>
          {dummyInterviews.map((interview) => {
            return <InterviewCard key={interview.id} {...interview} />;
          })}
        </div>
      </section>
    </>
  );
};
export default Home;
