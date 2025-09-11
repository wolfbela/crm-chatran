"use client";

import { Twitter, MessageCircle, Heart, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TwitterPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Twitter className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Twitter</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Twitter className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle>Gestion Twitter</CardTitle>
            <p className="text-muted-foreground">
              Cette fonctionnalité sera bientôt disponible pour gérer votre
              compte Twitter
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Tweets</p>
                  <p className="text-sm text-muted-foreground">
                    Publier et gérer vos tweets
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <RotateCcw className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Retweets</p>
                  <p className="text-sm text-muted-foreground">
                    Partages de contenu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Heart className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Mentions J&apos;aime</p>
                  <p className="text-sm text-muted-foreground">
                    Interactions favorites
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center pt-6">
              <Button disabled className="bg-blue-500 hover:bg-blue-600">
                Connecter Twitter
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Fonctionnalité en cours de développement
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
