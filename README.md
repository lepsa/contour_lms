# Getting Started

This project is built on the basis of [Vercel's](https://github.com/vercel/next.js/tree/canary/examples/with-supabase) examples. I've more-or-less left the authentication and user signup code untouched, as it worked perfectly well for what I needed. I did add one little ease of use button after users have signed up, kicking them back to the home page, as doing that manually was getting tiresome.

## Running The Server
I have not strayed from the example scripts for starting the application stack. As such, the following steps should get the application into a state where it is usable.

```
$ npm install
$ npx supabase start
```

At this point, the Supabase API Project URL and Publishable authentication key need to be copied to `.env.local` at the project root directory, following the example given below.

```
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Some_Value
```

Finally, run the Nextjs stack in development mode.

```
$ npm run dev
```

## Users

User authorisation is a lean implementation on top of the authentication that we get from Supabase, utilising a `app_role` table. This table is the primary mechanism for checking user access to records, along with the baked-in authorisation we can get from Supabase for row level checks.

- `user`: By default, all new users are assigned an application specific `user` roll in the `app_role` table. This role by itself doesn't grant them any special actions, and is used to enforce a distinction from the `admin` users, and to avoid issues around nulls in various checks.
- `admin`: Must be manually granted to a user in Supabase. This role, along with individual database table policies checking for it, allows for the viewing and updating of records not owned by the user.

### Making an `admin` user.
- Create a new user in the applicatio via the sign-up form.
- Enter the [Supabase Studio](http://localhost:54323) instance, and navigate to the authentication tab.
- Find your desired user, and copy or remember enough of the UID to identify the user in the next steps.
- Go to the table editor tab, and open the `app_role` table.
- Find the matching UID for your desired user, click on the `role` field and select `admin`.
- Refresh the LMS page and notice that your user welcome message in the top right is now red, indicating that you are an admin and should be careful.

## Consultations
Consultations are stored as a single record, as users aren't required to give a name when they sign up, nor were we asked to assume that users will have the same name through out their time on the platform. For data management, rather than deleting records when users cancel a consultation, I mark them as inactive. This is a common pattern in industry, and is near trivial to do in this scale of system.

# Scalability
My implementation should be very scalable, up to the limits of the postgres instance. There is very little meaningful application state that isn't stored in the database, allowing for the application server to be horizontally scaled on top of the database. Once the limits of single instance postgres are reached, options such as sharding or geographic isolation come into play, but each have their own issues. Sharding in particular would require a lot of support from Supabase to be viable.

# Best Practices
I've not had to write frontend javascript in for approximately a year, however nothing I've done here is particularly different from what I've done prior. My goal when writing code is to avoid surprises when and where I can, and to that end I have several practices I use for javascript/typescript.
- I eschew global state where possible, notwithstanding the usual culprits of authentication tokens in browser storage.
- Code Size: I try to resonably chunk the frontend components into small, manageable, and logical groupings, rewriting components where I find myself repeating patterns and looking for small abstractions (usually `map`, `reduce`, and `Promise` chaining) that don't lose the core idea.
- The use of immutable state, even if only by convention. This is a methodology formed from my experience in functional languages such as Haskell and Rust. Using `const` and `let` allows me to avoid many issues around accidental state updates.
- Typing: I'm fastidious in utilising types where I can to get the compiler to watch for mistakes, especially around the transposition of function arguements and object values.
- By practice, I use arrow functions where I can for all my definitions, as they provide a saner binding for `this` when I have to work with object oriented code.
- For this project in particular, I'm following the example guide and using `.env.local` for managing the variables holding configuration values to access the Supabase instance, and following the `NEXT_PUBLIC_` naming scheme as described by Nextjs.

# Security
This is an interesting topic, as given the nature of the project and the risk/reward profile it exposes, security here is mostly an academic concern.

I haven't bothered to set up a reverse proxy and automatic certificate service, as in general that requires a domain name, or for a user to accept self-signed certificates from otherwise unknown individuals. This is something to be suspicious of at the best of times, and I do not think that a coding interview is an appropriate place to be making that demand of the interviewer so that they can test the code.

Likewise, I have not set up a script to build and deploy the application to a webserver, instead I'm relying on Next and NPM to have a reasonably safe webserver for local demonstrations.

However, on the application side, I think I've done a reasonable job of securing the data itself against a mildly interested party. Data access, both read and write, is controlled within postgres itself, and identifiers for the consultations are randomly generated UUIDs coming from postgres. Using V4 UUIDs gives 122 bits of entropy, and is resistant to enumeration attacks. Similarly, user roles are stored in the database itself, and are checked on every access via row level policies. The alternative, putting these claims onto an authentication token, leaves rooms for a time of check / time of use attack where a user has some permission revoked after generating an auth token.

Keeping the user/admin divide small and simple, especially given the task requirements, allowed me to focus more on getting the details of the policies right, rather than fiddling with levels of indirection and ACLs. While it isn't particularly scalable in its current form, having NxM complexity in roles and tables, I feel that building out the control mechanisms any more is chasing hypotheticals without a justifying use case. Each line of code, especially around access control, is a liability in itself.

Finally, there is the topic of the javascript ecosystem itself. The requirements for this assessment specify several rather large suites/packages to perform some minor state management on both the server and client. Given the history of exploits targetting the NPM ecosystem, and rising number of supply chain attacks in the last several years, I would like to heavily prune the application stack if I was sending this to production.

# Assumptions

As with most code where it can be summed up as being a "CRUD API with a fancy wrapper", many assumptions have been made throughout the whole stack, from the sociological and national down to the ways in which space curves and how that is changing. In no particular order, I've listed the assumptions I'm aware of, and that I know would require some amount of thought if this was to be developed further into a product going out to the masses.

- Supabase uses atomic transactions for reading and especially for writing to the database. I have not taken any steps to handle synchronisation of reads and writes to the database beyond what Supabase offers out of the box with its query model.
- Real-time synchronisation between users (i.e. an admin and user, or two admins) looking at the same record is not a concern. I'm relying on the database consistency checks and row level policies to keep things in a sane state when conflicting updates are made.
- Generally, users shouldn't be allowed to interact with, or even know, other users and their consultations exist. Admins are special.
- All users are barred from changing anyones access. You have to have (more-or-less) direct database access to do that. Given that adding and removing admins in any system should be fairly rare, I don't see this as too much of a hassle for the system admin managing this server.
- Users shouldn't be allowed to schedule meetings in the past. Causality is important.
- I'm targetting an exclusively English speaking user base. As a mono-lingual person, I don't have the knowledge to even attempt a translation, let alone the nessacary localisation work that goes along with it.
- Users are based in Australia, this is for some of the time formatting so I'm not exposing bare datetime strings in the UI.
- Users aren't colourblind. I applied colours to buttons as I saw fit with little rhyme or reason other than that they looked good enough.
- Screen readers and other accessibility tools aren't being used. Like most react apps, this is built from a shocking number of `div`s, and CSS is used to build structure where semantic tags would offer browsers and tools a clearer idea of where the important content is.
- Tricky things, like leap seconds and countries changing which side of the international date line they are on, are special events and are best left in the capable hands of the maintainers of the tzdb and associated libraries.