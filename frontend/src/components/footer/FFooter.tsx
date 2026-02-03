import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">Hilexa</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Explore the world with Hilexa. Your spot destination for flight,
              and unique styles.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<Instagram />} />
              <SocialIcon icon={<Facebook />} />
              <SocialIcon icon={<Twitter />} />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Booking Policy</li>
              <li>Refund & Cancellation</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Services</li>
            </ul>
          </div>

         
        </div>
       
      </div>

       <div className="w-full border-1 mt-10 mx-10"/>

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <span>© 2021 All Rights Reserved</span>
          <div className="flex flex-wrap gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Sales and Refunds</span>
            <span>Legal</span>
            <span>Site Map</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border text-red-500 hover:bg-red-500 hover:text-white transition">
      {icon}
    </div>
  )
}
