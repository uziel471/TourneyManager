import {
  useSnackbar,
  SnackbarOrigin,
  BaseVariant,
  SnackbarKey,
} from "notistack";
import { Button } from "@/components/ui/button";
import { ArrowBigDown } from "lucide-react";

const defaultPosition: SnackbarOrigin = {
  vertical: "top",
  horizontal: "right",
};

function useSnackNotification() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (snackbarId: SnackbarKey) => (
    <Button
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
    >
      <ArrowBigDown />
    </Button>
  );

  const showSnackMessage = (
    message: string,
    type: BaseVariant,
    position: SnackbarOrigin = defaultPosition,
    duration = 7000,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onExited: any = undefined,
  ) => {
    enqueueSnackbar(message, {
      variant: type,
      action,
      autoHideDuration: duration,
      anchorOrigin: { ...position },
      ...(onExited && { onExited }),
    });
  };

  const successMessage = (
    message: string,
    position?: SnackbarOrigin,
    duration?: number,
    onExited?: unknown,
  ) => showSnackMessage(message, "success", position, duration, onExited);

  const errorMessage = (
    message: string,
    position?: SnackbarOrigin,
    duration?: number,
  ) => showSnackMessage(message, "error", position, duration);

  const warningMessage = (
    message: string,
    position?: SnackbarOrigin,
    duration?: number,
  ) => showSnackMessage(message, "warning", position, duration);

  const infoMessage = (
    message: string,
    position?: SnackbarOrigin,
    duration?: number,
  ) => showSnackMessage(message, "info", position, duration);

  return {
    showSnackMessage,
    successMessage,
    errorMessage,
    warningMessage,
    infoMessage,
  };
}

export default useSnackNotification;
