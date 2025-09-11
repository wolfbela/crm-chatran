"use client";

import { Instagram, Heart, MessageCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InstagramPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Instagram className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold">Instagram</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Instagram className="h-8 w-8 text-pink-600" />
            </div>
            <CardTitle>Gestion Instagram</CardTitle>
            <p className="text-muted-foreground">
              Cette fonctionnalité sera bientôt disponible pour gérer votre
              compte Instagram
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Camera className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="font-medium">Publications</p>
                  <p className="text-sm text-muted-foreground">
                    Gérer vos posts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Messages directs</p>
                  <p className="text-sm text-muted-foreground">DMs Instagram</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Heart className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Interactions</p>
                  <p className="text-sm text-muted-foreground">
                    Likes et commentaires
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center pt-6">
              <Button
                disabled
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Connecter Instagram
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
