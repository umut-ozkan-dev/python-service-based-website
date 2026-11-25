from app.adapters.base import ChannelAdapter
from app.adapters.local_adapter import LocalLogAdapter
from app.adapters.webhook_adapter import HttpWebhookAdapter
from app.core.config import Settings
from app.models.enums import DispatchChannel


def _select(url: str, token: str, timeout: float) -> ChannelAdapter:
    if url.startswith("https://") or url.startswith("http://"):
        return HttpWebhookAdapter(url, token, timeout)
    return LocalLogAdapter()


class AdapterRegistry:
    def __init__(self, settings: Settings) -> None:
        timeout = settings.webhook_timeout_seconds
        self._adapters: dict[DispatchChannel, ChannelAdapter] = {
            DispatchChannel.EMAIL_ACK: _select(
                settings.email_webhook_url, settings.email_webhook_auth_token, timeout
            ),
            DispatchChannel.SMS_ACK: _select(
                settings.sms_webhook_url, settings.sms_webhook_auth_token, timeout
            ),
            DispatchChannel.CRM_SYNC: _select(
                settings.crm_webhook_url, settings.crm_webhook_auth_token, timeout
            ),
            DispatchChannel.FOUNDER_ALERT: _select(settings.founder_alert_webhook_url, "", timeout),
        }

    def for_channel(self, channel: DispatchChannel) -> ChannelAdapter:
        return self._adapters[channel]
