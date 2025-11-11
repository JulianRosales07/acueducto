import { Plus, Droplet, Button } from "lucide-react"

export default function HeaderPage() {
    return (

        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 mb-">
            <div className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                            <Droplet className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Gestión de Matrículas
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Sistema Acueducto - Control y Administración</p>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Nueva Matrícula
                    </Button>
                </div>
            </div>
        </div>


    );
}