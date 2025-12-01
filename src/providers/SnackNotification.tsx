import { SnackbarProvider } from "notistack";

interface Props {
  children: React.ReactNode;
}

function NotiStackProvider({ children }: Props) {
  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      hideIconVariant
    >
      {children}
    </SnackbarProvider>
  );
}

export default NotiStackProvider;
