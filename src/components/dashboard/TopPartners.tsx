
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Play } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  initial: string;
  progress: number;
  platforms: string[];
}

const partners: Partner[] = [
  {
    id: "1",
    name: "BioLabs Inc.",
    initial: "B",
    progress: 65,
    platforms: ["facebook", "twitter", "linkedin"]
  },
  {
    id: "2",
    name: "MedTech Research",
    initial: "M",
    progress: 65,
    platforms: ["facebook", "twitter", "linkedin"]
  },
  {
    id: "3",
    name: "AnimalCare Pro",
    initial: "A",
    progress: 65,
    platforms: ["facebook", "twitter", "linkedin"]
  }
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  return (
    <div className="h-5 w-5 rounded-full flex items-center justify-center">
      {platform === "facebook" && (
        <svg className="h-4 w-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      )}
      {platform === "twitter" && (
        <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      )}
      {platform === "linkedin" && (
        <svg className="h-4 w-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      )}
    </div>
  );
};

const TopPartners = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {partners.map((partner) => (
        <Card key={partner.id} className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 rounded-xl h-12 w-12 flex items-center justify-center text-xl font-bold text-gray-500">
                {partner.initial}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{partner.name}</h3>
                <div className="flex gap-2 mt-1">
                  {partner.platforms.map((platform) => (
                    <PlatformIcon key={platform} platform={platform} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{partner.progress}% monitored</span>
                <span className="text-gray-400">Not run yet</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-400 rounded-full"
                  style={{ width: `${partner.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Details
              </Button>
              <Button className="w-full bg-rose-500 hover:bg-rose-600">
                <Play className="h-4 w-4 mr-2" />
                Run Scans
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TopPartners;
