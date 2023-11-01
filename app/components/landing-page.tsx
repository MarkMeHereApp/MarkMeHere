import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { firaSansLogo } from '@/utils/fonts';
import {
  CheckCircledIcon,
  ClockIcon,
  RocketIcon,
  ChatBubbleIcon
} from '@radix-ui/react-icons';
import { PiChalkboardTeacher, PiChatTeardropDots } from 'react-icons/pi';
import { Icons } from '@/components/ui/icons';
import { FaSchool } from 'react-icons/fa';
import { AiOutlineQrcode, AiOutlinePlus } from 'react-icons/ai';
import { SlLocationPin } from 'react-icons/sl';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { BsPatchExclamation } from 'react-icons/bs';
import { TbMessageChatbot } from 'react-icons/tb';
import { ContinueButton } from '@/components/general/continue-button';
import { WaitList } from './waitlist-form';
export default async function LandingPage() {
  return (
    <>
      <section className="space-y-6 pt-6 py-12 md:pt-10 lg:py-24">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1
            className={`${firaSansLogo.className} font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl`}
          >
            Welcome to Mark Me Here!
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Managing Attendance Takes Too Much Time, We Are Fixing That.
          </p>

          <div className="space-x-4">
            <Link href="/create-school">
              <ContinueButton name="Join Our Alpha Now!" />
            </Link>
            <Link href="/create-school">
              <Button variant="outline">View Demo</Button>
            </Link>
          </div>
        </div>
      </section>
      <section
        id="get-started"
        className="container space-y-6  py-8 md:py-12 lg:py-24"
      >
        <div className="mx-auto grid justify-center gap-16 sm:grid-cols-2 max-w-[64rem] md:grid-cols-2">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[500px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <PiChalkboardTeacher className="h-16 w-16 mr-6" />
                  <h3 className="font-bold">Are you a Teacher?</h3>
                </div>
                <p className="pb-4 ">Start using our alpha for free today!</p>
                <ul className="space-y-2 pb-4">
                  <li className="flex items-center">
                    <CheckCircledIcon className="mr-2" />
                    <span>Full Canvas Integration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircledIcon className="mr-2" />
                    <span>QR Code Attendance with Geolocation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircledIcon className="mr-2" />
                    <span>Data Analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircledIcon className="mr-2" />
                    <span>Email hashing to comply with FERPA</span>
                  </li>
                  <div className="border-2 border-gray-300 rounded p-2">
                    <h4 className="font-bold pb-2">Coming Soon</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <ClockIcon className="mr-2" />
                        <span>Chat Bot to manage attendance policies</span>
                      </li>
                      <li className="flex items-center">
                        <ClockIcon className="mr-2" />
                        <span>Daily AI Updates</span>
                      </li>
                      <li className="flex items-center">
                        <ClockIcon className="mr-2" />
                        <span>Calendar, Tasks, and Messaging</span>
                        <span>
                          {' '}
                          <Link href="/create-school" className="ml-2">
                            <ContinueButton
                              size="xs"
                              variant="outline"
                              name="Learn More"
                            />
                          </Link>
                        </span>
                      </li>
                    </ul>
                  </div>
                </ul>
              </div>
              <div className="space-x-4">
                <Link href="/create-school" className="ml-2">
                  <ContinueButton name="Join our Alpha Now!" />
                </Link>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[450px] flex-col justify-between rounded-md p-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <FaSchool className="h-16 w-16 mr-6" />
                  <h3 className="font-bold">Are you a School?</h3>
                </div>
                <p className="pb-4 ">
                  We're working hard to make Mark Me Here! available for full
                  school-wide integrations. Contact us today to get ahead on
                  integrations.
                </p>
                <div className="border-2 border-gray-300 rounded p-2">
                  <h4 className="font-bold pb-2">Coming Soon</h4>
                  <ul className="space-y-2 pb-4">
                    <li className="flex items-center">
                      <CheckCircledIcon className="mr-2" />
                      <span>LTI 1.3 Support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircledIcon className="mr-2" />
                      <span>MySQL, Postgres, and MS SQL support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircledIcon className="mr-2" />
                      <span>
                        Use our hosted platform to get started quickly
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircledIcon className="mr-2" />
                      <span>Or Self-host and receive integration support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircledIcon className="mr-2" />
                      <span>
                        Supporting over 15+ Authentication integrations
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-x-4 ml-2 my-6">
                <WaitList />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
        </div>
        <div className="mx-auto grid justify-center gap-4 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
              <Icons.canvas className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Canvas Integration</h3>
                <p className="text-sm text-muted-foreground">
                  For individual teachers using Canvas, we automatically sync
                  your course data.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
              <div className="flex space-x-4">
                <AiOutlineQrcode className="h-12 w-12" />
                <div className="flex items-center">
                  <AiOutlinePlus className="h-6 w-6" />
                </div>
                <SlLocationPin className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">QR Codes + Geolocation</h3>
                <p className="text-sm text-muted-foreground">
                  Take attendance quickly with QR codes and geolocation.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
              <IoAnalyticsOutline className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Understand your attendance data at a glance.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" mx-auto justify-center md:max-w-[64rem] border rounded-lg border-black">
          <div className="pt-6 px-6">Coming Soon...</div>
          <div className=" p-6 grid  gap-4 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[230px] flex-col justify-between rounded-md p-6">
                <PiChatTeardropDots className="h-12 w-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Syllabus Chat Bot</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your syllabus and let your students manage their
                    attendance with our chat bot according to your policy.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2 ">
              <div className="flex h-[230px] flex-col justify-between rounded-md p-6">
                <BsPatchExclamation className="h-12 w-12" />

                <div className="space-y-2 pb-10">
                  <h3 className="font-bold">Daily AI Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll update you daily with AI, so you know what's going on
                    in your class.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[230px] flex-col justify-between rounded-md p-6">
                <div className="flex space-x-4 justify-between">
                  <RocketIcon
                    className="h-12 w-12"
                    style={{ minWidth: '48px' }}
                  />
                  <div className="px-4">
                    <Link href="/create-school">
                      <ContinueButton size="sm" name="Learn More" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold">Calendar, Tasks and Messaging</h3>
                  <p className="text-sm text-muted-foreground">
                    Attendance is the first phase in our mission. We are
                    building an entire AI-powered dashboard to manage your
                    classroom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
