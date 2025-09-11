"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Phone, Settings, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface WhatsAppMessage {
  id: string;
  contactId: string;
  message: string;
  timestamp: Date;
  isOutgoing: boolean;
  status: "sent" | "delivered" | "read";
}

function WhatsAppContent() {
  const searchParams = useSearchParams();
  const [isConnected, setIsConnected] = useState(false);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [selectedContact, setSelectedContact] =
    useState<WhatsAppContact | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadContacts = useCallback(() => {
    const phone = searchParams.get("phone");
    const contactName = searchParams.get("contact");

    const mockContacts: WhatsAppContact[] = [
      {
        id: "1",
        name: "Sarah Cohen",
        phone: "+33123456789",
        lastMessage: "À bientôt pour notre prochain meeting",
        timestamp: new Date(Date.now() - 3600000),
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: "2",
        name: "David Levy",
        phone: "+33987654321",
        lastMessage: "Merci pour les informations",
        timestamp: new Date(Date.now() - 7200000),
        unreadCount: 0,
        isOnline: false,
      },
    ];

    if (phone && contactName) {
      const existingContact = mockContacts.find((c) => c.phone === phone);
      if (!existingContact) {
        const newContact: WhatsAppContact = {
          id: `contact_${Date.now()}`,
          name: contactName,
          phone: phone,
          lastMessage: "Nouveau contact depuis l'application",
          timestamp: new Date(),
          unreadCount: 0,
          isOnline: false,
        };
        mockContacts.unshift(newContact);
      }
    }

    setContacts(mockContacts);
  }, [searchParams]);

  const loadMessages = useCallback((contactId: string) => {
    const mockMessages: WhatsAppMessage[] = [
      {
        id: "1",
        contactId,
        message: "Salut ! Comment ça va ?",
        timestamp: new Date(Date.now() - 7200000),
        isOutgoing: false,
        status: "read",
      },
      {
        id: "2",
        contactId,
        message: "Ça va bien merci ! Et toi ?",
        timestamp: new Date(Date.now() - 3600000),
        isOutgoing: true,
        status: "read",
      },
    ];
    setMessages(mockMessages);
  }, []);

  const handleConnect = async () => {
    setIsConnected(true);
  };

  const handleSelectContact = useCallback(
    (contact: WhatsAppContact) => {
      setSelectedContact(contact);
      loadMessages(contact.id);
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c)),
      );
    },
    [loadMessages],
  );

  useEffect(() => {
    if (isConnected) {
      loadContacts();
    }
  }, [isConnected, loadContacts]);

  useEffect(() => {
    const phone = searchParams.get("phone");
    const contactName = searchParams.get("contact");

    if (phone && contactName && isConnected) {
      const contact = contacts.find(
        (c) => c.phone === phone || c.name === contactName,
      );
      if (contact) {
        handleSelectContact(contact);
      } else {
        // Créer un nouveau contact temporaire
        const newContact: WhatsAppContact = {
          id: `temp_${Date.now()}`,
          name: contactName,
          phone: phone,
          lastMessage: "Nouveau contact",
          timestamp: new Date(),
          unreadCount: 0,
          isOnline: false,
        };
        setContacts((prev) => [newContact, ...prev]);
        setSelectedContact(newContact);
      }
    }
  }, [searchParams, contacts, isConnected, handleSelectContact]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: WhatsAppMessage = {
      id: Date.now().toString(),
      contactId: selectedContact.id,
      message: newMessage,
      timestamp: new Date(),
      isOutgoing: true,
      status: "sent",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id
          ? { ...c, lastMessage: newMessage, timestamp: new Date() }
          : c,
      ),
    );
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery),
  );

  if (!isConnected) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Connexion à WhatsApp</CardTitle>
              <p className="text-sm text-muted-foreground">
                Connectez-vous à votre compte WhatsApp pour accéder à vos
                conversations
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleConnect}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Se connecter à WhatsApp
              </Button>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Un QR code sera généré pour scanner avec votre téléphone
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Liste des contacts */}
      <div className="w-1/3 border-r bg-background">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-green-600" />
            <h1 className="font-semibold">WhatsApp</h1>
            <Badge variant="secondary" className="ml-auto">
              Connecté
            </Badge>
          </div>
          <Input
            placeholder="Rechercher un contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto h-full">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                selectedContact?.id === contact.id ? "bg-muted" : ""
              }`}
              onClick={() => handleSelectContact(contact)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{contact.name}</p>
                    {contact.unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="bg-green-600 text-xs px-1.5 py-0.5"
                      >
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.lastMessage}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {contact.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* En-tête de conversation */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedContact.isOnline ? "En ligne" : "Hors ligne"}
                  </p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOutgoing ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.isOutgoing
                        ? "bg-green-600 text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isOutgoing
                          ? "text-green-100"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">
                Sélectionnez une conversation
              </p>
              <p className="text-sm text-muted-foreground">
                Choisissez un contact pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WhatsAppPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-lg font-medium">Chargement...</p>
          </div>
        </div>
      }
    >
      <WhatsAppContent />
    </Suspense>
  );
}
