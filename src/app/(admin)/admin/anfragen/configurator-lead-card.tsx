import {
    BatteryStorageConfiguratorLeadCard,
    ClimateConfiguratorLeadCard,
    HeatPumpConfiguratorLeadCard,
    WallboxConfiguratorLeadCard,
} from "./product-configurator-lead-card";
import {
    PhotovoltaicConfiguratorLeadCard,
} from "./photovoltaic-configurator-lead-card";

import {
    isBatteryStorageConfiguratorLead,
    isClimateConfiguratorLead,
    isHeatPumpConfiguratorLead,
    isPhotovoltaicConfiguratorLead,
    isWallboxConfiguratorLead,
    type ConfiguratorLead,
} from "@/types/configurator";

interface ConfiguratorLeadCardProps {
    lead: ConfiguratorLead;
}

export function ConfiguratorLeadCard({
    lead,
}: ConfiguratorLeadCardProps) {
    if (
        isPhotovoltaicConfiguratorLead(
            lead,
        )
    ) {
        return (
            <PhotovoltaicConfiguratorLeadCard
                lead={lead}
            />
        );
    }

    if (
        isBatteryStorageConfiguratorLead(
            lead,
        )
    ) {
        return (
            <BatteryStorageConfiguratorLeadCard
                lead={lead}
            />
        );
    }

    if (
        isWallboxConfiguratorLead(
            lead,
        )
    ) {
        return (
            <WallboxConfiguratorLeadCard
                lead={lead}
            />
        );
    }

    if (
        isHeatPumpConfiguratorLead(
            lead,
        )
    ) {
        return (
            <HeatPumpConfiguratorLeadCard
                lead={lead}
            />
        );
    }

    if (
        isClimateConfiguratorLead(
            lead,
        )
    ) {
        return (
            <ClimateConfiguratorLeadCard
                lead={lead}
            />
        );
    }

    return null;
}