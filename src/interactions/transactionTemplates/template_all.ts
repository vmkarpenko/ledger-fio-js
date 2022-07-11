import type {HexString, ParsedTransaction, ValidBIP32Path} from "../../types/internal"
import { Command, templateAlternative, COMMAND_INIT,  COMMAND_APPEND_CONST_DATA, COMMAND_FINISH, COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW} from "./commands"
import { date_to_buf, uint16_to_buf, uint32_to_buf } from "../../utils/serialize"
import { validate } from "../../utils/parse"
import { InvalidDataReason } from "../../errors";
import { template_trnsfiopubky } from "./template_trnsfiopubky";
import { template_newfundsreq } from "./template_newfundsreq";
import { template_recordopt } from "./template_recordobt";
import { template_addaddress } from "./template_addaddress";
import { template_remaddress } from "./template_remaddress";
import { template_addnft } from "./template_addnft";
import { template_remnft } from "./template_remnft";
import { template_remalladdr } from "./template_remalladdr";
import { template_cancelfndreq } from "./template_cancelfndreq";
import { template_rejectfndreq } from "./template_rejectfndreq";
import { template_addbundles } from "./template_addbundles";
import { template_regaddress } from "./template_regaddress";
import { template_xferaddress } from "./template_xferaddress";
import { template_regdomain } from "./template_regdomain";
import { template_renewdomain } from "./template_renewdomain";
import { template_setdomainpub } from "./template_setdomainpub";
import { template_xferdomain } from "./template_xferdomain";
import { template_remallnfts } from "./template_remallnfts";
import { template_stakefio } from "./template_stakefio";
import { template_unstakefio } from "./template_unstakefio";
import { template_voteproducer } from "./template_voteproducer";
import { template_voteproxy } from "./template_voteproxy";

export function templete_all(chainId: HexString, tx: ParsedTransaction, parsedPath: ValidBIP32Path): Array<Command> {
    //Validate template expectations
    validate(tx.context_free_actions.length == 0, InvalidDataReason.CONTEXT_FREE_ACTIONS_NOT_SUPPORTED);
    validate(tx.actions.length == 1, InvalidDataReason.MULTIPLE_ACTIONS_NOT_SUPPORTED);

    //Match action
    const actionCommands:Array<Command> = templateAlternative([
        template_trnsfiopubky, 
        template_newfundsreq,
        template_recordopt,
        template_addaddress,
        template_remaddress,
        template_addnft,
        template_remnft,
        template_remalladdr,
        template_cancelfndreq,
        template_rejectfndreq,
        template_addbundles,
        template_regaddress,
        template_xferaddress,
        template_regdomain,
        template_renewdomain,
        template_setdomainpub,
        template_xferdomain,
        template_remallnfts,
        template_stakefio,
        template_unstakefio,
        template_voteproducer,
        template_voteproxy,
    ])(chainId, tx, parsedPath)
    if (actionCommands.length == 0) return [];

    return [
        COMMAND_INIT(chainId, parsedPath),
        COMMAND_APPEND_DATA_BUFFER_DO_NOT_SHOW(Buffer.concat([
            date_to_buf(tx.expiration).reverse(), 
            uint16_to_buf(tx.ref_block_num).reverse(),
            uint32_to_buf(tx.ref_block_prefix).reverse()
        ]), 10, 10),
        COMMAND_APPEND_CONST_DATA("0000000001" as HexString),
        ...actionCommands,
        COMMAND_APPEND_CONST_DATA("000000000000000000000000000000000000000000000000000000000000000000" as HexString),
        COMMAND_FINISH(parsedPath),
    ];
}