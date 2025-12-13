import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Transformasi Layanan Konsultasi Anda?</h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan pemerintah daerah modern yang menggunakan teknologi AI untuk layanan konsultasi digital
          yang lebih baik
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 h-12 text-base">
            Gunakan Chatbot Helpdesk Sekarang
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 h-12 text-base bg-transparent"
          >
            Hubungi Komdigi
          </Button>
        </div>
      </div>
    </section>
  )
}
