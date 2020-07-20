import styled from 'styled-components/macro';

import Affix from '../../../components/common/Affix';

const TeamAffix = styled(Affix)`
  color: #FFA54F;

  & + & {
    margin-top: 12px;
  }
`;

export default TeamAffix;
