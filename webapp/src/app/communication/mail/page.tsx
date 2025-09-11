"use client";

import { Mail, Inbox, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MailPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Mail</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Gestion des emails</CardTitle>
            <p className="text-muted-foreground">
              Cette fonctionnalité sera bientôt disponible pour gérer vos emails
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Inbox className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Boîte de réception</p>
                  <p className="text-sm text-muted-foreground">
                    Gérer les emails entrants
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Send className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Envois</p>
                  <p className="text-sm text-muted-foreground">
                    Emails envoyés
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Favoris</p>
                  <p className="text-sm text-muted-foreground">
                    Messages importants
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center pt-6">
              <Button disabled className="bg-blue-600 hover:bg-blue-700">
                Configurer la messagerie
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
