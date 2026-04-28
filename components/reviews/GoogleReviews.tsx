import { Container } from "@/components/ui/Container";

type Review = {
  author_name: string;
  rating: 5;
  text: string;
  relative_time_description: string;
};

const REVIEWS: Review[] = [
  {
    author_name: "Kelsey Quintana",
    rating: 5,
    text: `Avery did an amazing job detailing my Mazda CX-5! He was very nice and respectful. He came to my house and it was such an easy process to get my car looking new again. I would highly recommend Revelation Auto Collective detailing!`,
    relative_time_description: "13 weeks ago",
  },
  {
    author_name: "Chris Konnecke",
    rating: 5,
    text: `Avery recently detailed mine and my wife's cars. He did an outstanding job! Price was great!`,
    relative_time_description: "13 weeks ago",
  },
  {
    author_name: "Isaiah Casarez",
    rating: 5,
    text: `I got my car detailed with Revelation Auto Collective and they did an amazing job! came to my house and made it easy seamless process to get my car looking spotless!`,
    relative_time_description: "13 weeks ago",
  },
  {
    author_name: "Kevin A. Delgadillo",
    rating: 5,
    text: "10/10 detailing !!!",
    relative_time_description: "13 weeks ago",
  },
  {
    author_name: "Brookelyn Francis",
    rating: 5,
    text: `Avery was so great!!! Incredible service, and super personable! Asked me what I wanted most work on and made the whole car look great!`,
    relative_time_description: "7 days ago",
  },
  {
    author_name: "Collin Johnson",
    rating: 5,
    text: `Avery did such a good job for me! I got my dad's car cleaned as a gift and he did such a good job making it look new again. Definitely would recommend.`,
    relative_time_description: "3 days ago",
  },
];

export function GoogleReviews() {
  const reviews = REVIEWS.slice(0, 8);

  return (
    <section className="border-t-2 border-border bg-surface">
      <Container className="py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="heading text-3xl">5-star Google Reviews</h2>
            <p className="mt-2 text-sm text-muted">
              Real feedback from local drivers. Updated daily.
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-8 rounded-2xl border-2 border-border bg-white p-6 text-sm text-muted">
            Reviews will appear here once Google Places is connected.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, idx) => (
              <div
                key={`${r.author_name}-${idx}`}
                className="rounded-2xl border-2 border-border bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{r.author_name}</div>
                  <div className="text-sm text-muted">★★★★★</div>
                </div>
                <p className="mt-3 text-sm text-muted">{r.text}</p>
                <div className="mt-3 text-xs text-muted">
                  {r.relative_time_description}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

