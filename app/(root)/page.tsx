import Image from "next/image";
import Link from "next/link";
import React from "react";

import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

const Home = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user!.id!),
    await getLatestInterviews({ userId: user!.id! }),
  ]);

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

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
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>You have no past interviews</p>
          )}
        </div>
      </section>

      <section className={"flex flex-col gap-6 mt-8"}>
        <h2>Take an interview</h2>
        <div className={"interviews-section"}>
          {hasUpcomingInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>There are no new interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};
export default Home;
