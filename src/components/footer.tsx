export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container flex items-center justify-center py-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DineHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
