import styled from 'styled-components/macro';

const Affix = styled.div`
  height: 32px;
  line-height: 32px;
  font-size: 26px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: stretch;
  align-items: stretch;

  & > * {
    flex-shrink: 1;
    flex-grow: 0;
    min-width: 0;
    max-width: 100%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default Affix;
